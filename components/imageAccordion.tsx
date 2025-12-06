// @ts-nocheck
'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { PLACEHOLDER_IMAGES } from '@/lib/placeholder-config';
import { ImageActionBar } from '@/components/image-action-bar';

export type AccordionItem = {
  id: string | number;
  url: string;
  title: string;
  description: string;
  tags?: string[];
};

// Generate placeholder items dynamically from config
export const placeholderItems: AccordionItem[] = PLACEHOLDER_IMAGES.map((url, i) => ({
  id: i + 1,
  url,
  title: 'Tattoo Design',
  description: 'Your generated tattoo designs will appear here.',
  tags: [],
}));

function Gallery({ items, setIndex, setOpen, index }:{
  items: AccordionItem[];
  setIndex: (index: number) => void;
  setOpen: (open: boolean) => void;
  index: number;
}) {
  return (
    <div className='rounded-md w-fit mx-auto md:gap-2 gap-1 flex pb-20 pt-10 items-center justify-center flex-wrap'>
      {items.map((item, i) => {
        return (
          <motion.img
            whileTap={{ scale: 0.95 }}
            className={`rounded-2xl ${
              index === i
                ? 'w-[500px]'
                : 'xl:w-[50px] md:w-[30px] sm:w-[20px] w-[14px]'
            } h-[500px] shrink-0 object-cover transition-[width] ease-in-out duration-300 cursor-pointer`}
            key={item.id}
            onMouseEnter={() => {
              setIndex(i);
            }}
            onMouseLeave={() => {
              setIndex(i);
            }}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            src={item?.url}
          />
        );
      })}
    </div>
  );
}

export interface ImageAccordionProps {
  items?: AccordionItem[];
  onAddToGallery?: (item: AccordionItem) => void;
  onAddToLiked?: (item: AccordionItem) => void;
  onShare?: (item: AccordionItem) => void;
  onDownload?: (item: AccordionItem) => void;
  onDelete?: (item: AccordionItem) => void;
}

export default function ImageAccordion({ 
  items = placeholderItems,
  onAddToGallery,
  onAddToLiked,
  onShare,
  onDownload,
  onDelete,
}: ImageAccordionProps) {
  const [index, setIndex] = useState(Math.min(5, Math.floor(items.length / 2)));
  const [open, setOpen] = useState(false);
  
  const displayItems = items.length > 0 ? items : placeholderItems;
  
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);
  
  return (
    <div className='relative'>
      <Gallery
        items={displayItems}
        index={index}
        setIndex={setIndex}
        setOpen={setOpen}
      />
      <AnimatePresence>
        {open !== false && displayItems[index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key='overlay'
            className='dark:bg-black/40 bg-white/40 backdrop-blur-lg fixed inset-0 z-50 top-0 left-0 bottom-0 right-0 w-full h-full grid place-content-center'
            onClick={() => {
              setOpen(false);
            }}
          >
            <div onClick={(e) => e.stopPropagation()} className='max-w-[90vw] max-h-[90vh]'>
              <motion.div
                className='rounded-2xl relative cursor-default overflow-hidden'
              >
                <Image
                  src={displayItems[index].url}
                  width={1200}
                  height={1200}
                  alt='single-image'
                  className='rounded-2xl w-auto h-auto max-w-[90vw] max-h-[80vh] object-contain'
                  unoptimized={displayItems[index].url.startsWith("data:") || displayItems[index].url.startsWith("http")}
                />
                <ImageActionBar
                  className='absolute bottom-4 left-1/2 -translate-x-1/2'
                  variant='overlay'
                  onAddToGallery={() => onAddToGallery?.(displayItems[index])}
                  onAddToLiked={() => onAddToLiked?.(displayItems[index])}
                  onShare={() => onShare?.(displayItems[index])}
                  onDownload={() => onDownload?.(displayItems[index])}
                  onDelete={() => onDelete?.(displayItems[index])}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
