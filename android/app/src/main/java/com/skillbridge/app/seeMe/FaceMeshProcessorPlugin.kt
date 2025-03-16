package com.skillbridge.app.seeMe

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.Image
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import java.io.ByteArrayOutputStream

/**
 * Frame processor plugin to detect facial landmarks using Mediapipe Face Landmarker.
 */
class FaceMeshProcessorPlugin(context: Context) : FrameProcessorPlugin() {
    private val faceLandmarker: FaceLandmarker

    init {
        // Configure Mediapipe Face Landmarker with the model asset
        val options = FaceLandmarker.FaceLandmarkerOptions.builder()
            .setBaseOptions(BaseOptions.builder().setModelAssetPath("face_landmarker.task").build())
            .setRunningMode(RunningMode.IMAGE) // Process each frame as an independent image
            .setNumFaces(1) // Detect only one face
            .setMinFaceDetectionConfidence(0.5f)
            .setMinTrackingConfidence(0.5f)
            .setMinFacePresenceConfidence(0.5f)
            .build()
        faceLandmarker = FaceLandmarker.createFromOptions(context, options)
    }

    /**
     * Process each camera frame to detect facial landmarks.
     */
    override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
        val image = frame.image
        val bitmap = imageToBitmap(image)
        val mpImage = BitmapImageBuilder(bitmap).build()

        // Detect landmarks using Mediapipe
        val result = faceLandmarker.detect(mpImage)
        val faceLandmarksList = result.faceLandmarks()

        if (faceLandmarksList.isNotEmpty()) {
            val faceLandmarks = faceLandmarksList[0]
            // Convert landmarks to a list of maps for React Native
            val landmarksList = faceLandmarks.map { landmark: NormalizedLandmark ->
                mapOf(
                    "x" to landmark.x().toDouble(),
                    "y" to landmark.y().toDouble(),
                    "z" to landmark.z().toDouble()
                )
            }
            return listOf(landmarksList) // Return as a list with one face's landmarks
        }
        return null // No face detected
    }

    /**
     * Convert Android Image to Bitmap for Mediapipe processing.
     * Note: This conversion may impact performance; optimize with native YUV processing if needed.
     */
    private fun imageToBitmap(image: Image): Bitmap {
        val planes = image.planes
        val yBuffer = planes[0].buffer
        val uBuffer = planes[1].buffer
        val vBuffer = planes[2].buffer

        val ySize = yBuffer.remaining()
        val uSize = uBuffer.remaining()
        val vSize = vBuffer.remaining()

        val nv21 = ByteArray(ySize + uSize + vSize)
        yBuffer.get(nv21, 0, ySize)
        vBuffer.get(nv21, ySize, vSize)
        uBuffer.get(nv21, ySize + vSize, uSize)

        val yuvImage = android.graphics.YuvImage(nv21, android.graphics.ImageFormat.NV21, image.width, image.height, null)
        val out = ByteArrayOutputStream()
        yuvImage.compressToJpeg(android.graphics.Rect(0, 0, yuvImage.width, yuvImage.height), 100, out)
        val imageBytes = out.toByteArray()
        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
    }
}