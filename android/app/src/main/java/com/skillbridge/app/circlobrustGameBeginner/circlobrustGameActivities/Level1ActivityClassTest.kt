/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities

import android.content.Intent
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import com.skillbridge.app.R
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runBlockingTest
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.*
import org.mockito.junit.MockitoJUnitRunner

@RunWith(MockitoJUnitRunner::class)
class Level1ActivityClassTest {

    private lateinit var scenario: ActivityScenario<Level1ActivityClass>
    private lateinit var lifecycleOwner: LifecycleOwner
    private lateinit var lifecycle: LifecycleRegistry

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level1ActivityClass::class.java)
        scenario = ActivityScenario.launch(intent)
        lifecycleOwner = mock(LifecycleOwner::class.java)
        lifecycle = LifecycleRegistry(lifecycleOwner)
        `when`(lifecycleOwner.lifecycle).thenReturn(lifecycle)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            val binding = activity.binding
            assert(binding.levelNumberView.text == "1")
            assert(binding.scoreTextView.text == "0")
            assert(binding.timeTextView.text == "00:00")
        }
    }

    @Test
    fun testIncrementScore() {
        scenario.onActivity { activity ->
            activity.incrementScore()
            assert(activity.score == 1)
            assert(activity.binding.scoreTextView.text == "1")
        }
    }

    @Test
    fun testOnBackPressed_showsExitDialog() {
        scenario.onActivity { activity ->
            activity.onBackPressed()
            val dialog = activity.supportFragmentManager.findFragmentByTag("exitDialog") as AlertDialog
            assert(dialog.isShowing)
        }
    }

    @Test
    fun testGoToLevel1CompleteActivity() {
        scenario.onActivity { activity ->
            activity.goToLevel1CompleteActivity()
            assert(activity.isFinishing)
        }
    }

    @Test
    fun testGoToLevel1LossActivity() {
        scenario.onActivity { activity ->
            activity.goToLevel1LossActivity()
            assert(activity.isFinishing)
        }
    }

    @ExperimentalCoroutinesApi
    @Test
    fun testStartTimer() = runBlockingTest {
        scenario.onActivity { activity ->
            activity.startTimer()
            advanceTimeBy(1000)
            assert(activity.timeInSeconds == 1)
            assert(activity.milliseconds == 0)
        }
    }

    @ExperimentalCoroutinesApi
    @Test
    fun testStartCountdownTimer() = runBlockingTest {
        scenario.onActivity { activity ->
            activity.startCountdownTimer()
            advanceTimeBy(10000)
            assert(activity.gameEnded)
        }
    }

    @Test
    fun testUpdateTimeInUi() {
        scenario.onActivity { activity ->
            activity.timeInSeconds = 5
            activity.milliseconds = 500
            activity.updateTimeInUi()
            assert(activity.binding.timeTextView.text == "05:50")
        }
    }

    @Test
    fun testUpdateScoreInUi() {
        scenario.onActivity { activity ->
            activity.score = 5
            activity.updateScoreInUi()
            assert(activity.binding.scoreTextView.text == "5")
        }
    }

    @Test
    fun testOnDestroy_stopsMediaPlayerAndCancelsTimers() {
        scenario.onActivity { activity ->
            val mediaPlayer = mock(MediaPlayer::class.java)
            activity.mediaPlayer = mediaPlayer
            activity.timerJob = mock(Job::class.java)
            activity.countdownJob = mock(Job::class.java)

            `when`(mediaPlayer.isPlaying).thenReturn(true)

            activity.onDestroy()

            verify(mediaPlayer).stop()
            verify(mediaPlayer).release()
            verify(activity.timerJob)?.cancel()
            verify(activity.countdownJob)?.cancel()
        }
    }

    @Test
    fun testGoToLevel1CompleteActivity_isCalledWhenScoreIsMet() {
        scenario.onActivity { activity ->
            activity.score = 10
            activity.checkScore()
            assert(activity.isFinishing)
        }
    }

    @Test
    fun testParseTimeString_validFormat() {
        scenario.onActivity { activity ->
            val (seconds, millis) = activity.parseTimeString("15:25")
            assert(seconds == 15)
            assert(millis == 250)
        }
    }

    @Test
    fun testParseTimeString_invalidFormat() {
        scenario.onActivity { activity ->
            val (seconds, millis) = activity.parseTimeString("abc")
            assert(seconds == 0)
            assert(millis == 0)
        }
    }

    @Test
    fun testStartTimer_incrementsTimeCorrectly() = runBlockingTest {
        scenario.onActivity { activity ->
            activity.startTimer()
            advanceTimeBy(10)
            assert(activity.milliseconds == 10)
            advanceTimeBy(990)
            assert(activity.timeInSeconds == 1)
            assert(activity.milliseconds == 0)
        }
    }
}*/