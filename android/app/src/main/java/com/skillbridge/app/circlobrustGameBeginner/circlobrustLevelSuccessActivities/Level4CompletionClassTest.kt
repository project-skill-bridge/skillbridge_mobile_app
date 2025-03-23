/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level4CompletionClassTest {

    private lateinit var scenario: ActivityScenario<Level4CompletionClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level4CompletionClass::class.java)
        scenario = ActivityScenario.launch<Level4CompletionClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            /
            // assert(activity.binding.levelNumberTextView.text == "Level 4 Complete")
        }
    }

    @Test
    fun testNextLevelButton_launchesLevel5Activity() {
        scenario.onActivity { activity ->
         
            activity.goToNextLevel(activity.binding.nextLevelButton)
            assert(activity.isFinishing)
            // You can add more assertions to check if the correct intent is launched
        }
    }

    @Test
    fun testReplayLevelButton_launchesLevel4Activity() {
        scenario.onActivity { activity ->
          
            activity.replayLevel(activity.binding.replayLevelButton)
            assert(activity.isFinishing)
        }
    }
}*/