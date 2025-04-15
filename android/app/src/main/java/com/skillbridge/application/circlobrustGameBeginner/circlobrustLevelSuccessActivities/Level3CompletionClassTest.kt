/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustLevelSuccessActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level3CompletionClassTest {

    private lateinit var scenario: ActivityScenario<Level3CompletionClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level3CompletionClass::class.java)
        scenario = ActivityScenario.launch<Level3CompletionClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            
            // assert(activity.binding.levelNumberTextView.text == "Level 3 Complete")
        }
    }

    @Test
    fun testNextLevelButton_launchesLevel4Activity() {
        scenario.onActivity { activity ->
           
            activity.goToNextLevel(activity.binding.nextLevelButton)
            assert(activity.isFinishing)
           
        }
    }

    @Test
    fun testReplayLevelButton_launchesLevel3Activity() {
        scenario.onActivity { activity ->
            
            activity.replayLevel(activity.binding.replayLevelButton)
            assert(activity.isFinishing)
            // Add assertions to check if the correct intent is launched
        }
    }
}*/