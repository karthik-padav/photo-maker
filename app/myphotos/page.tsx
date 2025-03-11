import { getControler, getMyImages } from "@/lib/actions/services";
import MyPhotosWrapper from "@/components/myPhotosWrapper";

export default async function MyPhotos() {
  const { data: imageData } = await getMyImages();
  const { data: controlerData } = await getControler();
  return (
    <MyPhotosWrapper controlerData={controlerData} imageData={imageData} />
  );
}
