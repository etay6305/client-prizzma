import React,{useState} from 'react';
import GenericSideButton from './genericSideButton/genericSideButton';
import Transmitterbox from '../transmitterBox/Transmitterbox';
import ShowTransmitters from '../showtransmitter/Showtransmitters';
import Chat1 from '../chat/Chat1';
import AddCoveragearea from '../addcoveragearea/AddCoveragearea';
import InformationOfcoverage from '../informationofcoverage/InformationOfcoverages';
import AddTransmitterLocation from '../addtransmitterlocation/AddTransmitterLocation';
import OverlapOfTransmitter from '../overlapalgorithem/OverlapOfTransmitter';
import OptimizationPage from '../optimizationpage/OptimizationPage';
import PlayVideo from '../playvideo/playvideo';
import TransmitterThumbnails from '../TransmitterThumbnails/TransmitterThumbnails';
const SideButton: React.FC = () => {
    const [showTransmitterBox, setShowTransmitterBox] = useState(false);
    const [showAllTransmitter, setShowAllTransmitter] = useState(false);
    const [openchat, setopenchat] = useState(false);
    const [openAddCoveragearea, setOpenAddCoveragearea] = useState(false);
    const [openInformationOfcities, setInformationOfCities] = useState(false);
    const [openTransmitterLocation, setOpentransmitterlocation] = useState(false);
    const [openOverlap, setopenOverlap] = useState(false);
    const [openOptimizationPage, setopenOptimizationPage] = useState(false);
    const [showplayvideo, setshowplayvideo] = useState(false);
    const [showThumnails, setshowThumnails] = useState(false);
    
    return (
        <>
        <div className="buttons-container">
        <GenericSideButton className='plus-button3' onClick={() => setShowTransmitterBox(!showTransmitterBox)}/>
        <GenericSideButton className='plus-button1' onClick={() => setShowAllTransmitter(!showAllTransmitter)}/>
        <GenericSideButton className='plus-button2' onClick={() => setopenchat(!openchat)}/>
        <GenericSideButton className='plus-button4' onClick={() => setOpenAddCoveragearea(!openAddCoveragearea)}/>
        <GenericSideButton className='plus-button5' onClick={() => setInformationOfCities(!openInformationOfcities)}/>
        <GenericSideButton className='plus-button6' onClick={() => setOpentransmitterlocation(!openTransmitterLocation)}/>
        <GenericSideButton className='plus-button7' onClick={() => setopenOverlap(!openOverlap)}/>
        <GenericSideButton className='plus-button8' onClick={() => setopenOptimizationPage(!openOptimizationPage)}/>
        <GenericSideButton className='plus-button9' onClick={() => setshowplayvideo(!showplayvideo)}/>
        {/* <GenericSideButton className='plus-button10' onClick={() => setshowThumnails(!showThumnails)}/> */}
        {showTransmitterBox && <Transmitterbox />}
        {showAllTransmitter && <ShowTransmitters />}
        {openchat && <Chat1 />}
        {openAddCoveragearea && <AddCoveragearea />}
        {openInformationOfcities && <InformationOfcoverage/>}
        {openTransmitterLocation && <AddTransmitterLocation/>}
        {openOverlap && <OverlapOfTransmitter/>}
        {openOptimizationPage && <OptimizationPage/>}
        {showplayvideo && <PlayVideo/>}
        {/* {showThumnails && <TransmitterThumbnails/>} */}
        </div>
        </>
    )
}

export default SideButton;
