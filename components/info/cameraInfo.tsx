import { Text } from 'react-native';
import infoStyles from './info.styles';

const CameraInfo = () => {
  return (
    <>
      <Text style={infoStyles.paragraph}>
        Camera Screen to capture image and upload it to patient's demographics.
      </Text>
      <Text style={infoStyles.title}>
        Note: After taking picture, you need to upload it by clicking on the EMR
        button.
      </Text>
    </>
  );
};

export default CameraInfo;
