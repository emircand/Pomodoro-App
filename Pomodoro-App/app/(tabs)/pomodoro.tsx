import { StyleSheet } from 'react-native';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { ThemedView } from '@/components/ThemedView';

export default function PomodoroScreen() {
  return (
    <ThemedView style={styles.container}>
      <PomodoroTimer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 