/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level2CompletionClassTest {

    private lateinit var scenario: ActivityScenario<Level2CompletionClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level2CompletionClass::class.java)
        scenario = ActivityScenario.launch<Level2CompletionClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            /
            // assert(activity.binding.levelNumberTextView.text == "Level 2 Complete")
        }
    }

    @Test
    fun testNextLevelButton_launchesLevel3Activity() {
        scenario.onActivity { activity ->
           
            activity.goToNextLevel(activity.binding.nextLevelButton)
            assert(activity.isFinishing)
          
        }
    }

    @Test
    fun testReplayLevelButton_launchesLevel2Activity() {
        scenario.onActivity { activity ->
          
            activity.replayLevel(activity.binding.replayLevelButton)
            assert(activity.isFinishing)
         
        }
    }
}*/