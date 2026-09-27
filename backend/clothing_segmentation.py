import io
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session
# pyrefly: ignore [missing-import]
import cv2

# Modeli belleğe bir kez yüklemek için global değişken
# u2net_cloth_seg modeli kıyafetleri (üst, alt, tam boy) ayırmak için eğitilmiştir.
session = None

def get_session():
    global session
    if session is None:
        # 'u2net_cloth_seg' modelini başlat
        session = new_session("u2net_cloth_seg")
    return session

def clean_mask(mask_np: np.ndarray, min_contour_area: int = 500) -> np.ndarray:
    """
    Maskeyi morfolojik işlemlerle temizler:
    1. Gaussian blur ile kenar yumuşatma
    2. Binary threshold ile net kesim
    3. Morphological close ile boşlukları doldurma
    4. Küçük konturları (gürültü) silme
    """
    # Gaussian blur — kenarları yumuşat
    blurred = cv2.GaussianBlur(mask_np, (5, 5), 0)
    
    # Binary threshold — net siyah-beyaz maske
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    
    # Morphological close — küçük boşlukları doldur
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    # Küçük konturları (gürültü parçalarını) sil
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cleaned = np.zeros_like(closed)
    for contour in contours:
        if cv2.contourArea(contour) >= min_contour_area:
            cv2.drawContours(cleaned, [contour], -1, 255, thickness=cv2.FILLED)
    
    # Son bir blur ile kenarları anti-alias yap
    final = cv2.GaussianBlur(cleaned, (3, 3), 0)
    
    return final

def isolate_clothing(image_bytes: bytes) -> bytes:
    """
    Görseldeki insan figürünü ve arka planı silip sadece kıyafeti izole eder.
    Gelişmiş morfolojik temizleme ile daha temiz sonuç üretir.
    """
    # Resmi yükle ve RGBA formatına çevir (saydamlık desteği için)
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    
    # u2net_cloth_seg modeli varsayılan olarak 3 ayrı maske döner:
    # masks[0]: üst giyim (upper body)
    # masks[1]: alt giyim (lower body)
    # masks[2]: tam boy (full body)
    masks = get_session().predict(input_image)
    
    # Tüm kıyafet parçalarını kapsayan ortak bir maske oluşturmak için
    # üç maskeyi numpy dizisine çevirip birleştiriyoruz (maksimum piksel değeri)
    mask_upper = np.array(masks[0])
    mask_lower = np.array(masks[1])
    mask_full = np.array(masks[2])
    
    combined_mask_np = np.maximum.reduce([mask_upper, mask_lower, mask_full])
    
    # Morfolojik temizleme uygula — gürültü, kenar düzensizlikleri ve küçük parçaları temizle
    cleaned_mask_np = clean_mask(combined_mask_np)
    
    combined_mask = Image.fromarray(cleaned_mask_np).convert("L")
    
    # Orijinal resmin boyutunda tamamen ŞEFFAF bir resim oluştur
    empty_image = Image.new("RGBA", input_image.size, (255, 255, 255, 0))
    
    # Orijinal resmi, maskenin beyaz olduğu yerlerde kullan, siyah yerlerde boş resmi kullan
    output_image = Image.composite(input_image, empty_image, combined_mask)
    
    # Sonucu byte array olarak döndür (PNG formatında — şeffaf arka plan)
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

