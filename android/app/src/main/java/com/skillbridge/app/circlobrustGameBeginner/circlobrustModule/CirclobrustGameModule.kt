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


class CirclobrustGameModule {
}