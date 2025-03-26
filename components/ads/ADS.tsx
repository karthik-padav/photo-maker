export default function ADS() {
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";
  console.log(showAds, "showAds");
  if (!showAds) return null;
  return <>ADS</>;
}
