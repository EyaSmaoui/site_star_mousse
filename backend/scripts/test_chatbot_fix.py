import sys
import os
import json
import importlib.util

root = os.path.abspath('..')
sys.path.insert(0, root)
app_path = os.path.join(root, 'backend', 'chatbot', 'app.py')
spec = importlib.util.spec_from_file_location('chatbot_app', app_path)
chatbot_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(chatbot_app)
app = chatbot_app.app
client = app.test_client()
for msg in ['Nheb nechri jraya', '190/160', 'orthopedique']:
    r = client.post('/chat', json={'message': msg})
    print('MSG:', msg)
    print('STATUS:', r.status_code)
    print(json.dumps(r.get_json(), ensure_ascii=False, indent=2))
    print('---')
