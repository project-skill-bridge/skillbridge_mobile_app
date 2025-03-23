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


class CirclobrustGameModule {
}