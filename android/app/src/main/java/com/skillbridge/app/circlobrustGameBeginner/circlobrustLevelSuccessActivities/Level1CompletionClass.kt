package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

// Imports for Android UI components, activity navigation, image loading, React Native bridge, and media playback
import android.app.Activity // For setting activity results
import android.content.Intent // For navigation between activities
import android.os.Bundle // For saved instance state handling
import android.widget.Button // For UI navigation buttons
import android.widget.ImageView // For displaying celebration animation
import androidx.appcompat.app.AppCompatActivity // Base class for activity
import com.bumptech.glide.Glide // Library for loading and displaying GIFs
import com.facebook.react.bridge.Arguments // For creating React Native event data
import com.facebook.react.bridge.ReactApplicationContext // For React Native integration
import com.facebook.react.bridge.ReactContext // For React Native context
import com.facebook.react.modules.core.DeviceEventManagerModule // For sending events to React Native
import android.media.MediaPlayer // For sound playback
import  com.skillbridge.app.circlobrustGameBeginner.MyNativeModules // Custom bridge to React Native
import com.skillbridge.app.R // Resource references

/* ================ Activity Class Section ================ 
 * Level 1 completion activity that displays success screen
 * Shows celebration animation and provides navigation options
 * Handles sound effects and React Native communication
 */
class Level1CompletionClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for React context, game state tracking, and audio playback
     */
    private lateinit var reactContext: ReactApplicationContext // React Native context for communication
    private var score = 0 // Player's score from the game
    private var LEVEL =  2 // Next level to navigate to
    private var mediaPlayerLoop: MediaPlayer? = null // Background celebration music
    private var mediaPlayerOnce: MediaPlayer? = null // One-time victory sound effect

}