import { useState, useEffect } from "react";
import { Alert, Image } from "react-native";
import { supabase, supabaseUrl } from "../supabase/supabaseClient";
import FullScreenImage from "./FullScreenImage";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

interface Props {
  path: string;
}

export default function BucketImage({ path }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function downloadImage() {
      try {
        const { data, error } = await supabase.storage
          .from("General Post Storage")
          .download(path);
        if (error) {
          Alert.alert(JSON.stringify(error.message));
        }
        const fr = new FileReader();
        if (data != null) {
          fr.readAsText(data);
          fr.onload = () => {
            setImageUrl(fr.result as string);
          };
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    }

    downloadImage();
  }, [path]);

  return imageUrl ? (
    <FullScreenImage imageUrl={imageUrl} />
  ) : (
    <ActivityIndicator
      style={{ margin: 20, width: "100%", aspectRatio: 1 }}
      animating={true}
      color={MD2Colors.purple100}
    />
  );
}
