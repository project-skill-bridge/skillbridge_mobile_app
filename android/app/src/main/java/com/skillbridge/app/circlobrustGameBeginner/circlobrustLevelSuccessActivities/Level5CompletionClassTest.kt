/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level5CompletionClassTest {

    private lateinit var scenario: ActivityScenario<Level5CompletionClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level5CompletionClass::class.java)
        scenario = ActivityScenario.launch<Level5CompletionClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            
            // assert(activity.binding.levelNumberTextView.text == "Level 5 Complete")
        }
    }

    @Test
    fun testNextLevelButton_launchesGameCompleteActivity() {
        scenario.onActivity { activity ->
          
            activity.goToNextLevel(activity.binding.nextLevelButton)
            assert(activity.isFinishing)
          
        }
    }

    @Test
    fun testReplayLevelButton_launchesLevel5Activity() {
        scenario.onActivity { activity ->
            activity.replayLevel(activity.binding.replayLevelButton)
            assert(activity.isFinishing)
        }
    }

    @Test
    fun testHomeButton_launchesMainActivity() {
        scenario.onActivity { activity ->
            activity.goToHome(activity.binding.homeButton)
            assert(activity.isFinishing)
        }
    }
}*/