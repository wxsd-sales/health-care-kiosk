import { TabContent } from '@momentum-ui/react';
import kaliedaVideo from './assests/kaleida-video.mp4';
import ReactPlayer from 'react-player/lazy';

const TV = () => {
  return <div>
    <ReactPlayer url={kaliedaVideo} playing controls/>
  </div>;
}

export default TV;