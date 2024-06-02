import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const SyncScrollBoxes: React.FC = () => {
  const boxesRef = useRef<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    const syncScroll = (source: HTMLElement) => {
      const boxes = boxesRef.current;
      if (!boxes) return;

      boxes.forEach(box => {
        if (box !== source) {
          box.scrollTop = source.scrollTop;
        }
      });
    };

    const handleScroll = (event: Event) => {
      console.log(123)
      const source = event.target as HTMLElement;
      syncScroll(source);
    };

    const boxes = document.querySelectorAll<HTMLElement>('.sync-scroll');
    boxesRef.current = boxes;
    boxes.forEach(box => {
      box.addEventListener('scroll', handleScroll);
    });

    return () => {
      boxes.forEach(box => {
        box.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  // 例として動的にボックスを生成する
  const boxes = [...Array(3).keys()].map(i => (
    <Box
      key={i}
      className="sync-scroll"
      sx={{ width: 300, height: 300, overflow: 'auto', border: '1px solid black', margin: 1 }}
    >
      {[...Array(50).keys()].map(j => <p key={j}>{`アイテム ${i} - ${j}`}</p>)}
    </Box>
  ));

  return <div>{boxes}</div>;
}

export default SyncScrollBoxes;
