import { useState, useEffect } from 'react'
import { Alert, Image } from 'react-native'
import { supabase, supabaseUrl } from '../supabase/supabaseClient'

interface Props {
	path: string
}

export default function BucketImage({ path }: Props) {
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	useEffect(() => {
		async function downloadImage() {
			try {
				console.log(path)
				const { data, error } = await supabase.storage.from('General Post Storage').download(path)

				if (error) {
					Alert.alert(JSON.stringify(error.message));
				}

				const fr = new FileReader()
				if (data != null) {
					fr.readAsText(data)
					fr.onload = () => {
						setImageUrl(fr.result as string)
						console.log(fr.result)
					}
				}
			} catch (error) {
				if (error instanceof Error) {
					console.log('Error downloading image: ', error.message)
				}
			}
		}

		downloadImage()
	}, [path])

	return imageUrl ? <Image resizeMode="contain"
		source={{ uri: 'data:image/jpeg;base64,' + imageUrl }}
		style={{ alignSelf: 'center', width: '100%', height: undefined, aspectRatio: 1 }} /> : null
}
