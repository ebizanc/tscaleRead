import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Button, FlatList, Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_URL } from './src/config';

export default function App() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '알 수 없는 오류';
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isListRenderable = useMemo(() => {
    return Array.isArray(data);
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>서버 데이터 조회</Text>
      <View style={styles.actions}>
        <Button title="새로고침" onPress={fetchData} />
      </View>

      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" />
          <Text style={styles.subtle}>불러오는 중...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>오류: {error}</Text>
          <View style={{ height: 8 }} />
          <Button title="다시 시도" onPress={fetchData} />
        </View>
      )}

      {!loading && !error && data == null && (
        <View style={styles.centerBox}>
          <Text style={styles.subtle}>데이터가 없습니다.</Text>
        </View>
      )}

      {!loading && !error && data != null && (
        isListRenderable ? (
          <FlatList
            style={styles.list}
            data={data as unknown[]}
            keyExtractor={(_, idx) => String(idx)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.mono}>{safeStringify(item)}</Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.item}>
            <Text style={styles.mono}>{safeStringify(data)}</Text>
          </View>
        )
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  subtle: {
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    color: '#c00',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  separator: {
    height: 8,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
  },
});

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
