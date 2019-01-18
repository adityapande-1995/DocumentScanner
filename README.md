# DocumentScanner
Process images of documents to look like scans.

## Dependencies:
This program requires flask as a backend and opencv (3.2.0) to process the image.

## Running
```
python3 app.py
```
Then go to ```localhost:5000/``` in the browser.

## Gallery
![alt text](https://github.com/adityapande-1995/DocumentScanner/blob/master/1.gif "text")

## To be done:
* Text area detection using the EAST detector.
* OCR using the input from EAST and the Tesseract engine.
* Specify paper coordinates manually.
* GUI : Drop down menu for image selection, text log area.
