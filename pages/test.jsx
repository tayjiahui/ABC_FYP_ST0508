import { useState } from 'react';

function getOptionId(e){
  // console.log(e);
  const selectedValue = e.target.value;
  // console.log("value print" + selectedValue);
  const selectedOption = Array.from(e.target.list.options).find((option) => option.value === selectedValue);
  const selectedId = selectedOption ? selectedOption.getAttribute('data-id') : '';
  // console.log("id print" + selectedId);

  const returnArr = [selectedValue, selectedId]

  return returnArr;
}

export default function YourComponent() {
  const [selectedOption, setSelectedOption] = useState({ value: '', id: '' });

  // Your component code

  const handleInputChange = (e) => {
    const [ value, id ] = getOptionId(e);
    setSelectedOption({ value: value, id: id });
  };

  return (
    <div>
      <input list="options" onChange={handleInputChange} />
      <datalist id="options">
        <div>
          <option value="Option 1" data-id="1" />
        </div>
        <div>
          <option value="Option 2" data-id="2" />
        </div>
        <div>
          <option value="Option 3" data-id="3" />
        </div>
        
      </datalist>
      <p>Selected Value: {selectedOption.value}</p>
      <p>Selected ID: {selectedOption.id}</p>
    </div>
  );
}
