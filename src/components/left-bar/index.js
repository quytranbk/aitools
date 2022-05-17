import { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { SHEET_TYPE } from '../../const';
import { AppContext } from '../state-provider';

export default function LeftBar () {
    const {
      state: {
  blackNoteDuration,
  sheetType,
  }, dispatch 
  } = useContext(AppContext);

    return <div className="w-[200px] px-3 bg-[#f0f0f0] border-l">
        <div className="py-2">
            <Form.Label>Độ dài</Form.Label>
            <Form.Control type="number" value={blackNoteDuration} onChange={(e) => 
dispatch('setBlackNoteDuration', e.target.value)} />
        </div>
        <div className="py-2">
            <Form.Label>Loại phổ</Form.Label>
            <Form.Check type="radio" name="sheedType" label="Ký tự nốt trên đàn" value={SHEET_TYPE.NOTE} checked={sheetType === SHEET_TYPE.NOTE} onChange={(e) => 
dispatch('setSheetType', e.target.value)} />
            {/* <Form.Check type="radio" name="sheedType" label="Nốt nhạc" value={SHEET_TYPE.POSITION} checked={sheetType === SHEET_TYPE.POSITION} onChange={(e) => setSheetType(e.target.value)} /> */}
            <Form.Check type="radio" name="sheedType" label="Guitar Tab" value={SHEET_TYPE.GUITAR} checked={sheetType === SHEET_TYPE.GUITAR} onChange={(e) => 
dispatch('setSheetType', e.target.value)} />

        </div>
        <hr className="my-2" />
        <div className="py-2">
            <Form.Check type="checkbox" name="sheedType" label="Âm dài (Thổi sáo)" />
        </div>

    </div>;
}