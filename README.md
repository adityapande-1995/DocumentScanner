# DocumentScanner
Process images of documents to look like scans.

## Dependencies (Python 3):
* Flask microframework
* OpenCV 4.0
* EAST detection framework
* pytesseract

## Running
```
python3 app.py
```
Then go to ```localhost:5000/``` in the browser.

## Gallery
![alt text](https://github.com/adityapande-1995/DocumentScanner/blob/master/2.gif "text")

## To be done:
* Text area detection using the EAST detector.
* OCR using the input from EAST and the Tesseract engine.
* Specify paper coordinates manually.
* GUI : Drop down menu for image selection, text log area.
