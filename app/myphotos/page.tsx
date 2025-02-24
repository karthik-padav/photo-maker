import { getControler, getMyImages } from "@/lib/actions/services";
import MyPhotosWrapper from "@/components/myPhotosWrapper";

export default async function MyPhotos() {
  const { data: imageData } = await getMyImages();
  const { data: controlerData } = await getControler();
  console.log(imageData, "imageData123");
  console.log(controlerData, "controlerData123");
  return (
    <MyPhotosWrapper controlerData={controlerData} imageData={imageData} />
  );
}
