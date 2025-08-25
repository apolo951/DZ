# OpenCV.js Setup

This directory should contain the OpenCV.js library for advanced image processing.

## Installation

Download OpenCV.js from the official OpenCV website:
- https://docs.opencv.org/4.8.0/opencv.js

Or use a CDN version:
- https://docs.opencv.org/4.8.0/opencv.js
- https://unpkg.com/opencv.js@4.8.0/opencv.js

## Files needed

Place the following file in this directory:
- `opencv.js` - The main OpenCV.js library

## Usage

The OpenCV service will automatically try to load the library from this location first, 
then fall back to CDN versions if the local file is not available.

## Size Warning

The OpenCV.js file is quite large (~8MB). Consider serving it from a CDN in production
for better performance.