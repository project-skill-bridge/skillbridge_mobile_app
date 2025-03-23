package com.skillbridge.app.circlobrustGameBeginner.circlobrustModule

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import com.skillbridge.app.circlobrustGame.circlobrustGameActivities.Level1ActivityClass
import com.skillbridge.app.circlobrustGame.circlobrustGameActivities.Level2ActivityClass
import com.skillbridge.app.circlobrustGame.circlobrustGameActivities.Level3ActivityClass
import com.skillbridge.app.circlobrustGame.circlobrustGameActivities.Level4ActivityClass
import com.skillbridge.app.circlobrustGame.circlobrustGameActivities.Level5ActivityClass

class CirclobrustGameModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) , ActivityEventListener {


    companion object {
        private var instance: MyNativeModules? = null

        fun getInstance(): MyNativeModules? {
            return instance
        }
    }

    override fun getName(): String {
        return "LoginModule"
    }

    @ReactMethod
    fun showActivity1Screen(initialScore: Int, formattedTime: String, audioPosition: Int, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        this.promise = promise
        if (activity != null) {
            val intent = Intent(activity, Level1ActivityClass::class.java).apply {
                putExtra("INITIAL_SCORE", initialScore)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition)
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            activity.startActivityForResult(intent, 1001) // Unique requestCode
        } else {
            promise.reject("ERROR", "Activity is null")
        }
    }

    // Updated methods for Activities 2-5 with proper parameters
    @ReactMethod
    fun showActivity2Screen(
        initialScore: Int,
        formattedTime: String,
        audioPosition: Int,
        promise: Promise
    ) {
        val activity = reactApplicationContext.currentActivity
        this.promise = promise
        if (activity != null) {
            val intent = Intent(activity, Level2ActivityClass::class.java).apply {
                putExtra("INITIAL_SCORE", initialScore)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition)
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            activity.startActivityForResult(intent, 1002)
        } else {
            promise.reject("ERROR", "Activity is null")
        }
    }

    @ReactMethod
    fun showActivity3Screen(
        initialScore: Int,
        formattedTime: String,
        audioPosition: Int,
        promise: Promise
    ) {
        val activity = reactApplicationContext.currentActivity
        this.promise = promise
        if (activity != null) {
            val intent = Intent(activity, Level3ActivityClass::class.java).apply {
                putExtra("INITIAL_SCORE", initialScore)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition)
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            activity.startActivityForResult(intent, 1003)
        } else {
            promise.reject("ERROR", "Activity is null")
        }
    }

    @ReactMethod
    fun showActivity4Screen(
        initialScore: Int,
        formattedTime: String,
        audioPosition: Int,
        promise: Promise
    ) {
        val activity = reactApplicationContext.currentActivity
        this.promise = promise
        if (activity != null) {
            val intent = Intent(activity, Level4ActivityClass::class.java).apply {
                putExtra("INITIAL_SCORE", initialScore)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition)
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            activity.startActivityForResult(intent, 1004)
        } else {
            promise.reject("ERROR", "Activity is null")
        }
    }

    @ReactMethod
    fun showActivity5Screen(
        initialScore: Int,
        formattedTime: String,
        audioPosition: Int,
        promise: Promise
    ) {
        val activity = reactApplicationContext.currentActivity
        this.promise = promise
        if (activity != null) {
            val intent = Intent(activity, Level5ActivityClass::class.java).apply {
                putExtra("INITIAL_SCORE", initialScore)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition)
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            activity.startActivityForResult(intent, 1005)
        } else {
            promise.reject("ERROR", "Activity is null")
        }
    }




    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        when (requestCode) {
            1001 -> handleActivityResult(resultCode, data, 1001)
            1002 -> handleActivityResult(resultCode, data, 1002)
            1003 -> handleActivityResult(resultCode, data, 1003)
            1004 -> handleActivityResult(resultCode, data, 1004)
            1005 -> handleActivityResult(resultCode, data, 1005)
        }
    }

    private fun handleActivityResult(resultCode: Int, data: Intent?, requestCode: Int ) {
        if (resultCode == Activity.RESULT_OK) {
            val finalScore = data?.getIntExtra("FINAL_SCORE", 0) ?: 0
            val levelScore = data?.getIntExtra("LEVEL", 1) ?: 1
            val formattedTime = data?.getStringExtra("FORMATTED_TIME") ?: "00:00"
            val audioPosition = data?.getIntExtra("AUDIO_POSITION", 0) ?: 0
            val result = Arguments.createMap().apply {
                putInt("finalScore", finalScore)
                putInt("levelScore", levelScore)
                putString("formattedTime", formattedTime)
                putInt("audioPosition", audioPosition)
            }
            promise?.resolve(result)
        } else {
            promise?.reject("CANCELLED", "User cancelled the operation")
        }
        promise = null
    }



    override fun onNewIntent(intent: Intent?) {
        // Handle new intent if necessary
    }

    @ReactMethod
    fun emitNavigateToBackPage() {
        val reactContext = reactApplicationContext
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NavigateToBackPage", null)
    }



    @ReactMethod
    fun emitNavigateToActivity2() {
        val reactContext = reactApplicationContext
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NavigateToActivity2", null)
    }

    @ReactMethod
    fun emitNavigateToActivity3() {
        val reactContext = reactApplicationContext
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NavigateToActivity3", null)
    }

    @ReactMethod
    fun emitNavigateToActivity4() {
        val reactContext = reactApplicationContext
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NavigateToActivity4", null)
    }

}