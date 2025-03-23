package com.skillbridge.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.skillbridge.app.circlobrustGameBeginner.circlobrustModule.CirclobrustBeginnerGameModule


class GamePackageBeginnerLevel : ReactPackage {
    override fun createNativeModules(p0: ReactApplicationContext): List<NativeModule> {
        val list = mutableListOf<NativeModule>()
        list.add(CirclobrustBeginnerGameModule(p0)) 
        return list
    }

    override fun createViewManagers(p0: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList() 
    }
}
