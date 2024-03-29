import './FaceRecognition.css';

import PropTypes from 'prop-types';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
                <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    );
}

FaceRecognition.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    box: PropTypes.object.isRequired
};

export default FaceRecognition;