'use client';

import { useState, useEffect } from "react";

import Head from 'next/head';

import DraggableCard from './components/DraggableCard';
import DropArea from './components/DropArea';
import { classNames } from 'primereact/utils';
import RuneService from '../../../services/mobinogi/RuneService';

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

export default function MobinogiPage() {

  const defaultWidth = 640;
  const defaultHeight = 580;

  const [maxWidth, setMawWidth] = useState(defaultWidth);
  
  const handleDrop = (id) => {};

  const [runeList, setRuneList] = useState();

  const [classes, setClasses] = useState([
    { name: '전체', code: '' },
    { name: '수도사', code: '수도사' },
    { name: '화염술사', code: '화염술사' }
  ]);
  const [slots, setSlots] = useState([
    { name: '무기', code: '무기' },
    { name: '엠블럼', code: '엠블럼' },
    { name: '장신구', code: '장신구' },
    { name: '방어구', code: '방어구' },
  ]);
  const [rarities, setRarities] = useState([
    { name: '레어', code: '레어' },
    { name: '엘리트', code: '엘리트' },
    { name: '에픽', code: '에픽' },
    { name: '전설', code: '전설' },
    { name: '유니크', code: '유니크' },
  ]);

  const [selectedRune, setSelectedRune] = useState(null);
  const [selectedClass, setSelectedClass] = useState(""); // 직업
  const [selectedSlot, setSelectedSlot] = useState([]); // 부위
  const [selectedRarity, setSelectedRarity] = useState([]); // 등급

  const searchRune = async ( params={} ) => {
    try {
      const result = await RuneService.getDataList({
        searchClass: selectedClass,
        searchSlot: selectedSlot,
        searchRarity: selectedRarity,
        ...params,
      });
      setRuneList(result);
    } catch ( e ){
      console.error(e);
    }
  }

  const handleChangeClass = ( e ) => {
    setSelectedClass(e.value);
    searchRune({
      searchClass: e.value,
    });
  }
  const  handleChangeSlot  = ( e ) => {
    setSelectedSlot(e.value);
    searchRune({
      searchSlot: e.value,
    });
  }
  const  handleChangeRarity  = ( e ) => {
    setSelectedRarity(e.value);
    searchRune({
      searchRarity: e.value,
    });
  }

  useEffect(()=>{
    setSelectedRarity([]);
    setSelectedClass("");
    searchRune();
  }, []);

  return (
    <>
      <Head>
        <title>새로운 페이지 제목</title>
      </Head>
        <div
          id="main-container"
          className="w-full h-full p-0 pt-5 pb-5 m-0 flex justify-content-center"
        >
          <div
            id="body-container"
            className="flex flex-column col-5 row-1 h-full p-0 m-0"
            style={{
              width: maxWidth,
              maxWidth: maxWidth,
              minWidth: maxWidth,
              boxShadow: "darkgray 1px 1px 2px 2px"
            }}
          >
            <div className={classNames("item-slots", "flex", "flex-row")}>
              {/* Left */}
              <div className={classNames("flex", "flex-column", "col-3")}>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '무기' } slotName={ 'waepon' } desc="무기" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '악세사리' } slotName={ 'necklace' } desc="목걸이" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={'악세사리'} slotName={ 'ring1' } desc="반지1" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={'악세사리'} slotName={ 'ring2' } desc="반지2" onDrop={ handleDrop } />
                  </div>
                </div>
              </div>
              {/* Center */}
              <div className={classNames("flex", "flex-column", "col-6")}>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  {/*  */}
                </div>
              </div>
              {/* Right */}
              <div className={classNames("flex", "flex-column", "col-3")}>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '엠블럼' } slotName={ 'emblum' } desc="엠블럼" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '방어구' } slotName={ 'head' } desc="투구" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '방어구' } slotName={ 'chest' } desc="상의" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '방어구' } slotName={ 'legs' } desc="하의" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '방어구' } slotName={ 'hands' } desc="장갑" onDrop={ handleDrop } />
                  </div>
                </div>
                <div className={classNames("flex", "col-12", "justify-content-center")}>
                  <div className={classNames("item-slot", "flex")}>
                    <DropArea accept={ '방어구' } slotName={ 'feet' } desc="신발" onDrop={ handleDrop } />
                  </div>
                </div>
              </div>
            </div>
            <div className={ classNames('flex', 'flex-column', 'col-12') }>
              <div className={ classNames('flex', 'flex', 'col-12') }>
                <div className={ classNames('flex', 'flex', 'col-4') }>
                  <Dropdown
                    className={ classNames("w-full") }
                    value={ selectedClass }
                    options={ classes }
                    onChange={ handleChangeClass } 
                    optionLabel="name"
                    optionValue="code"
                  />
                </div>
                <div className={ classNames('flex', 'flex', 'col-4') }>
                  <MultiSelect
                    className={ classNames("w-full") }
                    value={ selectedSlot }
                    placeholder="부위"
                    options={ slots }
                    display="chip"
                    onChange={ handleChangeSlot } 
                    optionLabel="name"
                    optionValue="code"
                    maxSelectedLabels={3}
                  />
                </div>
                <div className={ classNames('flex', 'flex', 'col-4') }>
                  <MultiSelect
                    className={ classNames("w-full") }
                    value={ selectedRarity }
                    placeholder="등급"
                    options={ rarities }
                    display="chip"
                    onChange={ handleChangeRarity } 
                    optionLabel="name"
                    optionValue="code"
                    maxSelectedLabels={3}
                  />
                </div>
              </div>
            </div>
            <div>
              <strong>무기</strong>
              <div className={ classNames("flex", "flex-row", "flex-wrap") }>
                  {
                    runeList?.hasOwnProperty("무기") && runeList["무기"].map((rune, idx)=>(
                    <div
                      key={ `weapon-rune-item-${idx}` }
                      className={ classNames("flex", "flex-column", "col-1") }
                    >
                          <DraggableCard
                            key={ rune.runeId }
                            id={ rune.runeId }
                            src="/images/rune.png"
                            dndType={ rune.runeSlot }
                            item={ rune }
                            onClick={(e)=>{
                              console.log(e.value);
                              setSelectedRune(e.value);
                            }}
                          />
                        </div>
                    ))
                  }
              </div>
            </div>
            <div>
              <strong>방어구</strong>
              <div className={ classNames("flex", "flex-row", "flex-wrap") }>
                  {
                    runeList?.hasOwnProperty("방어구") && runeList["방어구"].map((rune, idx)=>(
                    <div
                      key={ `armor-rune-item-${idx}` }
                      className={ classNames("flex", "flex-column", "col-1") }
                    >
                          <DraggableCard
                            key={ rune.runeId }
                            id={ rune.runeId }
                            src="/images/rune.png"
                            dndType={ rune.runeSlot }
                            item={ rune }
                            onClick={(e)=>{
                              console.log(e.value);
                              setSelectedRune(e.value);
                            }}
                          />
                        </div>
                    ))
                  }
              </div>
            </div>
            <div>
              <strong>장신구</strong>
              <div className={ classNames("flex", "flex-row", "flex-wrap") }>
                  {
                    runeList?.hasOwnProperty("장신구") && runeList["장신구"].map((rune, idx)=>(
                    <div 
                      key={ `accessory-rune-item-${idx}` }
                      className={ classNames("flex", "flex-column", "col-1") }
                    >
                          <DraggableCard
                            key={ rune.runeId }
                            id={ rune.runeId }
                            src="/images/rune.png"
                            dndType={ rune.runeSlot }
                            item={ rune }
                            onClick={(e)=>{
                              console.log(e.value);
                              setSelectedRune(e.value);
                            }}
                          />
                        </div>
                    ))
                  }
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
