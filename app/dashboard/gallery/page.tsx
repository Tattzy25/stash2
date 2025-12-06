import { Results } from "@/components/results";
import { UploadedImagesProvider } from "@/components/uploaded-images-provider";

export default function Page() {
  return (
    <UploadedImagesProvider>
      <Results />
    </UploadedImagesProvider>
  );
}
