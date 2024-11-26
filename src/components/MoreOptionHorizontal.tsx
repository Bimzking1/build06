'use client';
import block from '@/assets/more-option/block.svg';
import optionHorizontal from '@/assets/profile/optionHorizontal.svg';

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList
} from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';

const MoreOptionHorizontal = ({
  profileData,
  handleSubmitBlockUser
}: any): any => {
  const [blockUser, setBlockUser] = React.useState(null);

  const handleOpenBlock = (value: any): void => {
    setBlockUser(value);
  };

  return (
    <>
      <div>
        <Menu placement="left-start">
          <MenuHandler>
            <Image
              src={optionHorizontal}
              alt="optionHorizontal"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </MenuHandler>
          <MenuList
            className={`list-none ${
              profileData?.status_blocked === true ? 'hidden' : 'flex'
            } flex-col font-poppins gap-2 p-2 text-sm font-normal leading-5`}
          >
            <MenuItem
              className="flex py-2 gap-2 cursor-pointer"
              style={{ color: '#FF3838' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF3838')}
              onClick={() => {
                handleOpenBlock('xs');
              }}
            >
              <Image src={block} alt="blockUser" />
              Block User
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* TODO: BLOCK MODAL */}
      <Dialog
        dismiss={{
          outsidePress: false
        }}
        open={blockUser === 'xs'}
        size={'xs'}
        handler={handleOpenBlock}
        className="text-center p-5 m-0 max-w-xs sm:max-w-xs md:max-w-xs lg:max-w-xs self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
      >
        <form onSubmit={handleSubmitBlockUser}>
          <DialogBody className="p-0 mb-6 font-poppins">
            <p className="text-base font-semibold leading-6 text-gray-900 p-0 mb-4">
              {`Block ${profileData?.name as string}`}
            </p>
            <p className="font-normal text-sm">
              They won’t be able to message you or find your profile, posts or
              story on Seeds.
            </p>
          </DialogBody>
          <DialogFooter className="p-0">
            <button
              type="submit"
              className="rounded-full min-w-full bg-[#DD2525] h-10 text-sm font-semibold capitalize text-white transition-all mb-6 font-poppins"
              data-ripple-light="true"
              onClick={() => {
                handleOpenBlock(null);
              }}
            >
              Block
            </button>
            <Button
              variant="text"
              color="white"
              onClick={() => {
                handleOpenBlock(null);
              }}
              className="min-w-full hover:bg-transparent focus:bg-transparent text-[#3AC4A0] text-sm font-semibold rounded-full capitalize p-0 font-poppins"
            >
              <span>Cancel</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default MoreOptionHorizontal;
