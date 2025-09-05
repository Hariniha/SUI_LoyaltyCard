import { useState, ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Text, Heading, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function MintNFT() {
  // Loyalty NFT Listing
  const [loyaltyNFTs, setLoyaltyNFTs] = useState<any[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const currentAccount = useCurrentAccount();

  async function fetchLoyaltyNFTs() {
  if (!currentAccount || !currentAccount.address) return;
    setLoadingNFTs(true);
    try {
  const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' }); // Change to mainnet URL if needed
      const objects = await client.getOwnedObjects({ owner: currentAccount.address });
      // Filter for Loyalty NFTs
      const loyaltyObjects = objects.data.filter((obj: any) =>
        obj.data?.type?.endsWith('loyalty_card::Loyalty')
      );
      setLoyaltyNFTs(loyaltyObjects);
    } catch (e) {
      setLoyaltyNFTs([]);
    }
    setLoadingNFTs(false);
  }

  // Fetch NFTs on mount and when account changes
  useEffect(() => {
    fetchLoyaltyNFTs();
  }, [currentAccount?.address]);
  const nftPackageId = useNetworkVariable("nftPackageId");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [txDigest, setTxDigest] = useState<string | null>(null);
  // Add Points
  const [loyaltyIdAdd, setLoyaltyIdAdd] = useState<string>("");
  const [pointsToAdd, setPointsToAdd] = useState<string>("");
  // Redeem Points
  const [loyaltyIdRedeem, setLoyaltyIdRedeem] = useState<string>("");
  const [pointsToRedeem, setPointsToRedeem] = useState<string>("");
  // Burn Loyalty
  const [loyaltyIdBurn, setLoyaltyIdBurn] = useState<string>("");
  // Check Status
  const [loyaltyIdStatus, setLoyaltyIdStatus] = useState<string>("");
  const [isActiveResult, setIsActiveResult] = useState<string>("");

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
  // Add Points
  const handleLoyaltyIdAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoyaltyIdAdd(e.target.value);
  };
  const handlePointsToAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPointsToAdd(e.target.value);
  };
  // Redeem Points
  const handleLoyaltyIdRedeemChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoyaltyIdRedeem(e.target.value);
  };
  const handlePointsToRedeemChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPointsToRedeem(e.target.value);
  };
  // Burn Loyalty
  const handleLoyaltyIdBurnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoyaltyIdBurn(e.target.value);
  };
  // Check Status
  const handleLoyaltyIdStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoyaltyIdStatus(e.target.value);
  };

  function mintNFT() {
    console.log('MintNFT function called', { customerAddress, imageUrl });
    console.log('nftPackageId:', nftPackageId);
    if (!customerAddress.startsWith('0x') || customerAddress.length < 40) {
      console.error('Invalid customer address:', customerAddress);
      return;
    }
    if (!nftPackageId || nftPackageId.length < 40) {
      console.error('Invalid nftPackageId:', nftPackageId);
      return;
    }
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::mint_loyalty`,
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
          // Refresh Loyalty NFT list after mint
          await fetchLoyaltyNFTs();
        },
        onError: (error) => {
          console.error('MintNFT transaction error:', error);
        },
      },
    );
  }

  function addPoints() {
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::loyalty_card::add_points`,
      arguments: [
        tx.object(loyaltyIdAdd), // AdminCap object id
        tx.object(loyaltyIdAdd), // Loyalty object id
        tx.pure.u64(Number(pointsToAdd)),
        // tx_context is auto-injected
      ],
    });
    signAndExecute({ transaction: tx });
  }

  function redeemPoints() {
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::loyalty_card::redeem_points`,
      arguments: [
        tx.object(loyaltyIdRedeem), // Loyalty object id
        tx.pure.u64(Number(pointsToRedeem)),
      ],
    });
    signAndExecute({ transaction: tx });
  }

  function burnLoyalty() {
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::loyalty_card::burn_loyalty`,
      arguments: [
        tx.object(loyaltyIdBurn), // AdminCap object id
        tx.object(loyaltyIdBurn), // Loyalty object id
      ],
    });
    signAndExecute({ transaction: tx });
  }

  async function checkStatus() {
    // This would normally be a view function, but Sui doesn't support view calls yet
    // You'd fetch the Loyalty object and compare valid_until with current epoch
    setIsActiveResult("Feature not supported in frontend yet. Please check on-chain.");
  }

  return (
    <Container size="1" style={{ maxWidth: 500 }}>
      {/* Loyalty NFT List */}
      <Box style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '0.5rem' }}>
        <Heading size="4" style={{ marginBottom: '1rem' }}>Your Loyalty NFTs</Heading>
        {loadingNFTs ? (
          <Text>Loading...</Text>
        ) : loyaltyNFTs.length === 0 ? (
          <Text>No Loyalty NFTs found.</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loyaltyNFTs.map((obj: any) => (
              <Box key={obj.data.objectId} style={{ border: '1px solid #ccc', borderRadius: '0.5rem', padding: '1rem' }}>
                <Text size="2" weight="bold">Object ID: {obj.data.objectId}</Text>
                <Text size="2">Type: {obj.data.type}</Text>
                {/* You can add more fields here if you fetch object details */}
              </Box>
            ))}
          </div>
        )}
      </Box>
      <Box style={{ 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' 
      }}>
        <Heading size="4" style={{ marginBottom: '1rem' }}>Mint Loyalty NFT</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mint NFT */}
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
        {/* Add Points */}
        <Heading size="4" style={{ margin: '2rem 0 1rem 0' }}>Add Points (Admin)</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="rt-TextFieldInput"
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdAdd}
            onChange={handleLoyaltyIdAddChange}
          />
          <input
            className="rt-TextFieldInput"
            placeholder="Points to Add"
            value={pointsToAdd}
            onChange={handlePointsToAddChange}
            type="number"
          />
          <Button size="3" onClick={addPoints} disabled={!loyaltyIdAdd || !pointsToAdd}>Add Points</Button>
        </div>
        {/* Redeem Points */}
        <Heading size="4" style={{ margin: '2rem 0 1rem 0' }}>Redeem Points</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="rt-TextFieldInput"
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdRedeem}
            onChange={handleLoyaltyIdRedeemChange}
          />
          <input
            className="rt-TextFieldInput"
            placeholder="Points to Redeem"
            value={pointsToRedeem}
            onChange={handlePointsToRedeemChange}
            type="number"
          />
          <Button size="3" onClick={redeemPoints} disabled={!loyaltyIdRedeem || !pointsToRedeem}>Redeem Points</Button>
        </div>
        {/* Burn Loyalty Card */}
        <Heading size="4" style={{ margin: '2rem 0 1rem 0' }}>Burn Loyalty Card (Admin)</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="rt-TextFieldInput"
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdBurn}
            onChange={handleLoyaltyIdBurnChange}
          />
          <Button size="3" onClick={burnLoyalty} disabled={!loyaltyIdBurn}>Burn Loyalty Card</Button>
        </div>
        {/* Check Card Status */}
        <Heading size="4" style={{ margin: '2rem 0 1rem 0' }}>Check Card Status</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="rt-TextFieldInput"
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdStatus}
            onChange={handleLoyaltyIdStatusChange}
          />
          <Button size="3" onClick={checkStatus} disabled={!loyaltyIdStatus}>Check Status</Button>
          {isActiveResult && <Text size="2" color="blue">{isActiveResult}</Text>}
        </div>
      </Box>
    </Container>
  );
}

export default MintNFT;