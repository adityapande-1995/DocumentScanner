#!python3
from flask import Flask, render_template, request, send_file
import json, scanner
import glob

A = scanner.Scanner()
filename = None

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Wont need to hard refresh browser

@app.route('/')
def home():
    return render_template('index.html')

# Flip final.jpg horizontally/ vertically
@app.route('/flip', methods=['POST']) 
def fliph():
    if request.method == 'POST':
        s = json.loads(request.data)
        A.flip(s['flip'])

    return "Flipping image"

# Correct polygon found, orient the image
@app.route('/orient', methods=['POST'])
def ori():
    print("yes pressed !")
    if request.method == 'POST':
        s = json.loads(request.data)
        if s['thresh'] == "yes":
            param = [int(s['p1']), int(s['p2'])]
            A.pers_transform(True,param=param)
        else:
            A.pers_transform(False,None)

    return "Pers transform done and final.jpg saved"

# Return desired images
@app.route('/get_image')
def gfi():
    global filename
    if request.args.get('which') == 'final':
        return send_file('final.jpg', mimetype='image/jpg')
    elif request.args.get('which') == 'auto':
        return send_file('auto.jpg', mimetype='image/jpg')
    elif request.args.get('which') == 'orig':
        return send_file(filename, mimetype='image/jpg')

# Process path entered : Load image detect paper
@app.route('/process_image', methods=['POST'])
def clicked():
    print("key pressed !")
    if request.method == 'POST':
        s = json.loads(request.data)
        print("Loading ",s['file'])
        A.load_image(str(s['file']),1)
        A.autodetect_paper()

    return "Processing selected image"

# Set original image path
@app.route('/set_original', methods=['POST'])
def set_orig():
    global filename
    if request.method == 'POST':
        s = json.loads(request.data)
        print("Loading ",s['file'])
        filename = s['file']

    return "Setting selected image"

if __name__ == '__main__':
    app.run(debug=True)
