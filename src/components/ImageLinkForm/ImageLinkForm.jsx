import './ImageLinkForm.css';

import PropTypes from 'prop-types';

// here we destructure the props object to get the onInputChange and onButtonSubmit functions.
const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input 
                        className='f4 pa2 w-70 center' 
                        type='text' 
                        onChange={onInputChange} 
                    />
                    <button 
                        className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                        onClick={onButtonSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

ImageLinkForm.propTypes = {
    onInputChange: PropTypes.func.isRequired,
    onButtonSubmit: PropTypes.func.isRequired
};

export default ImageLinkForm;