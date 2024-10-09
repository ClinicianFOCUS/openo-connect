import { useAuthManagerStore } from "@/store/useAuthManagerStore";
import { StatusType } from "@/types/types";
import { useState } from "react";

/**
 * Custom hook for uploading an image to a demographic profile.
 *
 * @param {string} demographicNo - The demographic number to which the image will be uploaded.
 * @returns {Object} An object containing:
 * - `uploading` {boolean}: Indicates if the upload is in progress.
 * - `uploaded` {boolean}: Indicates if the upload has completed.
 * - `uploadMessage` {string}: A message indicating the result of the upload.
 * - `uploadImage` {function}: A function to upload an image. Takes a base64 encoded image string as a parameter.
 * - `setUploaded` {function}: A function to manually set the uploaded state.
 */
export const useImageUpload = (demographicNo: number) => {
  const { manager, provider } = useAuthManagerStore();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const uploadImage = async (base64Image: string) => {
    setUploading(true);

    //base64 image data shouldn't be in an array (o19 docs are wrong)
    //it breaks the API
    const data = {
      type: "photo",
      fileName: "open-o-connect-image",
      description: new Date().toLocaleString(),
      contentType: "image/jpeg",
      numberOfPages: 1,
      providerNo: provider.id,
      demographicNo: demographicNo,
      fileContents: base64Image,
    };

    manager
      ?.makeAuthorizedRequest(
        "POST",
        "document/saveDocumentToDemographic",
        data
      )
      .then((res) => {
        setUploading(false);
        setUploaded(true);
        if (res.status == StatusType.SUCCESS) {
          setUploadMessage("Image Uploaded Successfully!");
        } else {
          setUploadMessage("Image Upload Failed!");
        }
      });
  };

  return { uploading, uploaded, uploadMessage, uploadImage, setUploaded };
};
