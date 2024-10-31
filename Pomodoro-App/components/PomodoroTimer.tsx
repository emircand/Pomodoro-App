import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWorkMode, setIsWorkMode] = useState<boolean>(true);
  const [backgroundAnim] = useState(new Animated.Value(1));

  // Calculate the progress and background color
  const getBackgroundColor = useMemo(() => {
    const progress = isWorkMode 
      ? timeLeft / WORK_TIME 
      : 1 - (timeLeft / BREAK_TIME);

    // Work Mode: Red (255,0,0) -> Green (0,255,0)
    // Break Mode: Green (0,255,0) -> Red (255,0,0)
    const red = isWorkMode 
      ? Math.round(255 * progress)
      : Math.round(255 * (1 - progress));
    const green = isWorkMode 
      ? Math.round(255 * (1 - progress))
      : Math.round(255 * progress);

    return `rgba(${red}, ${green}, 0, 0.2)`;
  }, [timeLeft, isWorkMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsWorkMode(!isWorkMode);
    setTimeLeft(isWorkMode ? BREAK_TIME : WORK_TIME);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorkMode ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: getBackgroundColor }]}>
      <View style={styles.timerContainer}>
        <ThemedText type="title" style={styles.modeText}>
          {isWorkMode ? 'Work Time' : 'Break Time'}
        </ThemedText>
        
        <View style={[
          styles.timeDisplay,
          { borderColor: isWorkMode ? '#ff6b6b' : '#51cf66' }
        ]}>
          <ThemedText style={[
            styles.timerText,
            { color: isWorkMode ? '#ff6b6b' : '#51cf66' }
          ]}>
            {formatTime(timeLeft)}
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isWorkMode ? '#ff6b6b' : '#51cf66' }
            ]}
            onPress={toggleTimer}
          >
            <ThemedText style={styles.buttonText}>
              {isRunning ? 'Pause' : 'Start'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}
          >
            <ThemedText style={styles.buttonText}>
              Reset
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
  },
  modeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  timeDisplay: {
    borderWidth: 4,
    borderRadius: 20,
    padding: 20,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    letterSpacing: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#687076',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressFill: {
    height: '100%',
  },
});