import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { Text, Button, Appbar, Button as PaperButton, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // You may need to install expo-image-picker
import { supabase } from '../supabase/supabaseClient';
import { ImagePickerAsset } from 'expo-image-picker';

type Props = {
  setImage: React.Dispatch<React.SetStateAction<ImagePickerAsset | null | undefined>>;
  image: ImagePickerAsset | null | undefined
}

const ImageUpload = ({ setImage, image }: Props) => {
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      quality: 1,

    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        {image ? (
          <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>
      <PaperButton mode="contained" onPress={pickImage}>
        Pick an Image
      </PaperButton>
      <TextInput
        label="Image Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={{ margin: 16 }}
      />
    </View>
  );
};

export default ImageUpload;
