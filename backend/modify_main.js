const fs = require('fs');
let content = fs.readFileSync('main.py', 'utf-8');

const target = `                return {"error": str(e)}\n\n@app.get("/")`;
const replacement = `                return {"error": str(e)}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")`;

content = content.replace(target, replacement);

fs.writeFileSync('main.py', content, 'utf-8');