import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [ip, setIp] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const sendImage = async () => {
    if (!ip || !imageUri) {
      setError('Please provide IP and select an image');
      return;
    }

    setLoading(true);
    setError(null);
    setPredictions([]);

    try {
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await fetch(`http://${ip}:8080/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setPredictions(result.predictions);
      } else {
        setError(result.error || 'Server error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-xl font-bold mb-4">Insert Backend IP Address:</Text>
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="e.g., 192.168.0.1"
        value={ip}
        onChangeText={setIp}
        autoCapitalize="none"
        keyboardType="numeric"
      />

      <Button title="Select Image" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 200, marginVertical: 10 }} />
      )}

      <Button title="Mandar" onPress={sendImage} disabled={loading} />

      {loading && <Text className="mt-4">Sending image...</Text>}
      {error && <Text className="mt-4 text-red-600">Error: {error}</Text>}

      {predictions.length > 0 && (
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Predictions:</Text>
          {predictions.map((pred, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#f0f0f0',
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              <Text>Class: {pred.class}</Text>
              <Text>Confidence: {(pred.confidence * 100).toFixed(2)}%</Text>
              <Text>BBox: {pred.bbox.map((v) => v.toFixed(1)).join(', ')}</Text>
            </View>
          ))}

        </View>
      )}
    </ScrollView>
  );
}
