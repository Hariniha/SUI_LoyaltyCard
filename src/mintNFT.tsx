import { useState, ChangeEvent } from 'react';
import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Text, Heading, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function MintNFT() {
  const nftPackageId = useNetworkVariable("nftPackageId");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [txDigest, setTxDigest] = useState<string | null>(null);
  
  const {
    mutate: signAndExecute,
    isPending,
    isSuccess,
  } = useSignAndExecuteTransaction();

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomerAddress(e.target.value);
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  function mintNFT() {
    const tx = new Transaction();

    tx.moveCall({
      target: `${nftPackageId}::loyalty_card::mint_loyalty`,
      arguments: [
        tx.pure.address(customerAddress),
        tx.pure.string(imageUrl),
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          setTxDigest(digest);
        },
      },
    );
  }

  return (
    <Container size="1" style={{ maxWidth: 500 }}>
      <Box style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' 
      }}>
        <Heading size="4" style={{ marginBottom: '1rem' }}>Mint Loyalty NFT</Heading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <Text as="div" size="2" weight="medium" style={{ marginBottom: '0.25rem' }}>
              Customer Address
            </Text>
              <input 
                className="rt-TextFieldInput"
                placeholder="Enter Sui address"
                value={customerAddress}
                onChange={handleAddressChange}
                disabled={isPending || isSuccess}
              />
          </div>
          
          <div>
            <Text as="div" size="2" weight="medium" style={{ marginBottom: '0.25rem' }}>
              Image URL
            </Text>
              <input
                className="rt-TextFieldInput"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={handleImageUrlChange}
                disabled={isPending || isSuccess}
              />
          </div>
          
          <Button 
            size="3" 
            onClick={mintNFT}
            disabled={!customerAddress || !imageUrl || isPending || isSuccess}
          >
            {isPending ? <ClipLoader size={20} /> : isSuccess ? "NFT Minted!" : "Mint NFT"}
          </Button>
          
          {txDigest && (
            <Text size="2" color="green">
              Transaction: {txDigest}
            </Text>
          )}
        </div>
      </Box>
    </Container>
  );
}

export default MintNFT;