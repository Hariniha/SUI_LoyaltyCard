import { useState, ChangeEvent } from 'react';

import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Text, Heading, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function MintNFT() {
  // Feedback state for user actions
  const [redeemResult, setRedeemResult] = useState<string>("");
  // Feedback state for admin actions
  const [addPointsResult, setAddPointsResult] = useState<string>("");
  const [burnResult, setBurnResult] = useState<string>("");
  

  

  const nftPackageId = useNetworkVariable("nftPackageId");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [txDigest, setTxDigest] = useState<string | null>(null);
  // Add Points
  const [adminCapIdAdd, setAdminCapIdAdd] = useState<string>("");
  const [loyaltyIdAdd, setLoyaltyIdAdd] = useState<string>("");
  const [pointsToAdd, setPointsToAdd] = useState<string>("");
  // Redeem Points
  const [loyaltyIdRedeem, setLoyaltyIdRedeem] = useState<string>("");
  const [pointsToRedeem, setPointsToRedeem] = useState<string>("");
  // Burn Loyalty
  const [adminCapIdBurn, setAdminCapIdBurn] = useState<string>("");
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
  const handleAdminCapIdAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminCapIdAdd(e.target.value);
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
  const handleAdminCapIdBurnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminCapIdBurn(e.target.value);
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
        
        },
        onError: (error) => {
          console.error('MintNFT transaction error:', error);
        },
      },
    );
  }

  function addPoints() {
  setAddPointsResult("");
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::add_points`,
      arguments: [
        tx.object(adminCapIdAdd), // AdminCap object id
        tx.object(loyaltyIdAdd),  // Loyalty object id
        tx.pure.u64(Number(pointsToAdd)),
        // tx_context is auto-injected
      ],
    });
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setAddPointsResult(`Success! Transaction: ${digest}`);
            
          },
          onError: (error) => {
            setAddPointsResult(`Error: ${error.message || error}`);
          },
        }
      );
  }

  function redeemPoints() {
  setRedeemResult("");
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::redeem_points`,
      arguments: [
        tx.object(loyaltyIdRedeem), // Loyalty object id
        tx.pure.u64(Number(pointsToRedeem)),
      ],
    });
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          setRedeemResult(`Success! Transaction: ${digest}`);
          
        },
        onError: (error) => {
          setRedeemResult(`Error: ${error.message || error}`);
        },
      }
    );
  }

  function burnLoyalty() {
  setBurnResult("");
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::burn_loyalty`,
      arguments: [
        tx.object(adminCapIdBurn), // AdminCap object id
        tx.object(loyaltyIdBurn),  // Loyalty object id
      ],
    });
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setBurnResult(`Success! Transaction: ${digest}`);
          
          },
          onError: (error) => {
            setBurnResult(`Error: ${error.message || error}`);
          },
        }
      );
  }

  async function checkStatus() {
    // This would normally be a view function, but Sui doesn't support view calls yet
    // You'd fetch the Loyalty object and compare valid_until with current epoch
    setIsActiveResult("Feature not supported in frontend yet. Please check on-chain.");
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
            placeholder="AdminCap Object ID"
            value={adminCapIdAdd}
            onChange={handleAdminCapIdAddChange}
          />
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
          <Button size="3" onClick={addPoints} disabled={!adminCapIdAdd || !loyaltyIdAdd || !pointsToAdd}>Add Points</Button>
            {addPointsResult && <Text size="2" color={addPointsResult.startsWith('Success') ? 'green' : 'red'}>{addPointsResult}</Text>}
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
            {redeemResult && <Text size="2" color={redeemResult.startsWith('Success') ? 'green' : 'red'}>{redeemResult}</Text>}
        </div>
        {/* Burn Loyalty Card */}
        <Heading size="4" style={{ margin: '2rem 0 1rem 0' }}>Burn Loyalty Card (Admin)</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="rt-TextFieldInput"
            placeholder="AdminCap Object ID"
            value={adminCapIdBurn}
            onChange={handleAdminCapIdBurnChange}
          />
          <input
            className="rt-TextFieldInput"
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdBurn}
            onChange={handleLoyaltyIdBurnChange}
          />
          <Button size="3" onClick={burnLoyalty} disabled={!adminCapIdBurn || !loyaltyIdBurn}>Burn Loyalty Card</Button>
            {burnResult && <Text size="2" color={burnResult.startsWith('Success') ? 'green' : 'red'}>{burnResult}</Text>}
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