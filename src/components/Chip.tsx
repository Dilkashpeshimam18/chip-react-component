import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import './Chip.css';

type Item = {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

interface Chip extends Item { }

const Chip: React.FC = () => {

  const [chips, setChips] = useState<Chip[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const KEY = {
    backspace: 8,
    tab: 9,
    enter: 13
  };
  const INVALID_CHARS = /[^a-zA-Z0-9 ]/g;

  const items: Item[] = [
    { id: '1', name: 'Nick Giannopoulos', email: 'nick@example.com', photoUrl: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250' },
    { id: '2', name: 'John Doe', email: 'john@example.com', photoUrl: 'https://xsgames.co/randomusers/assets/avatars/male/8.jpg' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXUv6ZrOiS4QQaWCBlsw2zbj64_mcv8Bk-ZCLwDSWLznS_Iu2bxfnet_eaChBoikcPoCc&usqp=CAU' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', photoUrl: 'https://cloudcommercepro.com/wp-content/uploads/2022/06/dummy-customer.jpg' },
  ];

  //filtering list on type
  const handleFilterItems = (value: string) => {
    const filtered = items.filter((item) => !chips.find((chip) => chip.id === item.id) && item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredItems(filtered);
  };


  //logic for adding, removing & higligthing chips on enter & backspace
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setChips((prevChips) => [...prevChips, { id: Date.now().toString(), name: inputValue.trim() }] as Chip[]);
      setInputValue('');
      setHighlightedChip(null);
    }
    if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      const lastChipIndex = chips.length - 1;
      setHighlightedChip(lastChipIndex);

      setTimeout(() => {
        if (highlightedChip === lastChipIndex) {
          handleDeleteChip(chips[lastChipIndex].id);
        }
      }, 0);
    }
  };


  //handling input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.currentTarget.value;

    if (INVALID_CHARS.test(value)) {
      setInputValue(value.replace(INVALID_CHARS, ""));
    } else if (value.length > +20) {
      setInputValue(value.substr(0, +20));
      handleFilterItems(value);
      setHighlightedChip(null);
    } else {
      setInputValue(value);
      handleFilterItems(value);
      setHighlightedChip(null);
    }
  };

  //logic for deleting chip
  const handleDeleteChip = (chipId: string) => {
    setChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));
    const removedChip = items.find((item) => item.id === chipId);
    if (removedChip) {
      setFilteredItems((prevItems) => [...prevItems, removedChip]);
    }
    setInputValue('');
    setHighlightedChip(null);

  };

  const handleFocusInput = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let children = (event.currentTarget as HTMLDivElement).children;

    if (children.length) (children[children.length - 1] as HTMLInputElement).focus();
  };


  //selecting item from the list
  const handleItemClick = (item: Item) => {
    setChips((prevChips) => [...prevChips, { ...item }] as Chip[]);
    setFilteredItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    setInputValue('');
    setHighlightedChip(null);
  };


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chips]);



  return (
    <div className='chip-container'>

      <div className="chips" onClick={handleFocusInput}>
        {chips.map((chip, index) => (

          <div key={chip.id} className={`chip ${highlightedChip === index ? 'highlighted' : 'chip'}`}
            onClick={() => setHighlightedChip(index)} >

            {chip.photoUrl && <img className='itemList-image' src={chip.photoUrl} alt={chip.name} />
            }

            <span className={` chip-value ${highlightedChip === index ? 'highlighted' : 'chip-value'}`}>{chip.name}</span>
            <span className="chip-remove" onClick={() => handleDeleteChip(chip.id)}>
              X
            </span>
          </div>

        ))}
        <input
          type="text"
          className="chips-input"
          placeholder={chips.length < +20 ? "Add a tag" : ""}
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </div>
      <div className="item-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="item" onClick={() => handleItemClick(item)}>
            <div>
              <img className='itemList-image' src={item.photoUrl} alt={item.name} />

            </div>
            <div style={{ marginLeft: '6px', display: 'flex' }}>

              <div style={{ width: "90px", marginTop: "10px" }}><span style={{ fontSize: "11px" }}>{item.name}</span></div>
              <div style={{ marginTop: "9px" }}><span style={{ fontSize: "9px", color: "lightgray" }}>{item.email}</span></div>

            </div>

          </div>
        ))}
      </div>

    </div>
);
};

export default Chip;
