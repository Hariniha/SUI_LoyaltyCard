import { useState, ChangeEvent } from 'react';

import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Text, Heading, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import './styles.css';

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
  // const [loyaltyIdStatus, setLoyaltyIdStatus] = useState<string>("");
  // const [isActiveResult, setIsActiveResult] = useState<string>("");
  
  // Tiered Membership
  // const [selectedTier, setSelectedTier] = useState<string>("");
  // const [cardIdForTier, setCardIdForTier] = useState<string>("");
  
  // Transfer Card
  const [transferCardId, setTransferCardId] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  
  // Extend Expiry
  const [extensionCardId, setExtensionCardId] = useState<string>("");
  const [extensionDays, setExtensionDays] = useState<string>("");
  
  // Freeze Card
  const [freezeCardId, setFreezeCardId] = useState<string>("");
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  
  // Auto Burn
  // const [autoBurnEnabled, setAutoBurnEnabled] = useState<boolean>(false);

  const {
    mutate: mintSignAndExecute,
    isPending: isMintPending,
    isSuccess: isMintSuccess,
  } = useSignAndExecuteTransaction();

  const {
    mutate: addPointsSignAndExecute,
    isPending: isAddPointsPending,
  } = useSignAndExecuteTransaction();

  const {
    mutate: redeemSignAndExecute,
    isPending: isRedeemPending,
  } = useSignAndExecuteTransaction();

  const {
    mutate: burnSignAndExecute,
    isPending: isBurnPending,
  } = useSignAndExecuteTransaction();

  const {
    mutate: transferSignAndExecute,
    isPending: isTransferPending,
  } = useSignAndExecuteTransaction();

  const {
    mutate: extendSignAndExecute,
    isPending: isExtendPending,
  } = useSignAndExecuteTransaction();

  const {
    mutate: freezeSignAndExecute,
    isPending: isFreezePending,
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
  // const handleLoyaltyIdStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setLoyaltyIdStatus(e.target.value);
  // };

  // Tiered Membership handlers
  // const handleTierChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedTier(e.target.value);
  // };
  // const handleCardIdForTierChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setCardIdForTier(e.target.value);
  // };

  // Transfer Card handlers
  const handleTransferCardIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferCardId(e.target.value);
  };
  const handleRecipientAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  // Extend Expiry handlers
  const handleExtensionCardIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExtensionCardId(e.target.value);
  };
  const handleExtensionDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExtensionDays(e.target.value);
  };

  // Freeze Card handlers
  const handleFreezeCardIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFreezeCardId(e.target.value);
  };

  // Auto Burn handlers
  // const handleAutoBurnChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setAutoBurnEnabled(e.target.checked);
  // };

  // Handle transfer card
  const handleTransferCard = () => {
    if (!transferCardId || !recipientAddress) return;
    
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::transfer_loyalty`,
      arguments: [
        tx.object(transferCardId),
        tx.pure.address(recipientAddress),
      ],
    });
    transferSignAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          console.log(`Card transferred successfully. Transaction: ${digest}`);
        },
        onError: (error) => {
          console.error('Error transferring card:', error);
        },
      }
    );
  };

  // Handle extend expiry
  const handleExtendExpiry = () => {
    if (!extensionCardId || !extensionDays || !adminCapIdAdd) {
      console.error('Admin Cap, Card ID and Extension Days are required');
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::extend_validity`,
      arguments: [
        tx.object(adminCapIdAdd),
        tx.object(extensionCardId),
        tx.pure.u64(Number(extensionDays) * 86400), // Converting days to seconds
      ],
    });
    extendSignAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          console.log(`Card expiry extended successfully. Transaction: ${digest}`);
        },
        onError: (error) => {
          console.error('Error extending card expiry:', error);
        },
      }
    );
  };

  // Handle auto burn cleanup
  // const handleAutoBurnCleanup = () => {
  //   if (!loyaltyIdStatus) return;

  //   const tx = new Transaction();
  //   tx.moveCall({
  //     target: `${nftPackageId}::nftdapp::cleanup_expired`,
  //     arguments: [
  //       tx.object(loyaltyIdStatus),
  //     ],
  //   });
  //   signAndExecute(
  //     { transaction: tx },
  //     {
  //       onSuccess: async ({ digest }) => {
  //         console.log(`Auto burn check completed. Transaction: ${digest}`);
  //       },
  //       onError: (error) => {
  //         if (error.message.includes('100')) {
  //           console.log('Card was expired and burned');
  //         } else {
  //           console.error('Error checking card expiry:', error);
  //         }
  //       },
  //     }
  //   );
  // };

  const toggleFreeze = () => {
    if (!adminCapIdAdd || !freezeCardId) {
      console.error('Admin Cap and Card ID are required');
      return;
    }
    const tx = new Transaction();
    tx.moveCall({
      target: `${nftPackageId}::nftdapp::${isFrozen ? 'unfreeze_card' : 'freeze_card'}`,
      arguments: [
        tx.object(adminCapIdAdd), // AdminCap object
        tx.object(freezeCardId),  // Loyalty card object
      ],
    });
    freezeSignAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          setIsFrozen(!isFrozen);
          console.log(`Card ${isFrozen ? 'unfrozen' : 'frozen'} successfully. Transaction: ${digest}`);
        },
        onError: (error) => {
          console.error(`Error ${isFrozen ? 'unfreezing' : 'freezing'} card:`, error);
        },
      }
    );
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
    mintSignAndExecute(
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
      addPointsSignAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setAddPointsResult(`Success! Transaction: <a href="https://testnet.suivision.xyz/txblock/${digest}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline">${digest}</a>`);
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
    redeemSignAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          setRedeemResult(`Success! Transaction: <a href="https://testnet.suivision.xyz/txblock/${digest}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline">${digest}</a>`);
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
      burnSignAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setBurnResult(`Success! Transaction: <a href="https://testnet.suivision.xyz/txblock/${digest}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline">${digest}</a>`);
          },
          onError: (error) => {
            setBurnResult(`Error: ${error.message || error}`);
          },
        }
      );
  }

  // const [isStatusChecking, setIsStatusChecking] = useState(false);

  // async function checkStatus() {
  //   if (!loyaltyIdStatus) {
  //     setIsActiveResult("Please enter a Loyalty Card ID");
  //     return;
  //   }

  //   setIsStatusChecking(true);
  //   setIsActiveResult("Checking card status...");
  //   console.log("Checking status for card ID:", loyaltyIdStatus);

  //   try {
  //     // Small delay to allow the blockchain to process recent transactions
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     const requestBody = {
  //       jsonrpc: '2.0',
  //       id: 1,
  //       method: 'sui_getObject',
  //       params: [loyaltyIdStatus, {
  //         showContent: true,
  //         showDisplay: true,
  //         showType: true
  //       }]
  //     };
      
  //     console.log("Sending request:", JSON.stringify(requestBody, null, 2));
      
  //     const response = await fetch(`https://fullnode.testnet.sui.io/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         jsonrpc: '2.0',
  //         id: 1,
  //         method: 'sui_getObject',
  //         params: [loyaltyIdStatus]
  //       })
  //     });

  //     const data = await response.json();
  //     console.log("Response data:", JSON.stringify(data, null, 2));
      
  //     if (data.error) {
  //       console.error("API Error:", data.error);
  //       setIsActiveResult(`Error: ${data.error.message}`);
  //       return;
  //     }

  //     if (!data.result) {
  //       console.error("No result in response");
  //       setIsActiveResult("Error: Invalid response from the blockchain");
  //       return;
  //     }

  //     if (!data.result.data) {
  //       console.log("Object not found or not accessible");
  //       setIsActiveResult("Please wait a few seconds after minting. If this message persists, verify the card ID is correct and that you have permission to view it.");
  //       return;
  //     }

  //     const cardData = data.result.data;
  //     console.log('Card Data:', JSON.stringify(cardData, null, 2));

  //     if (!cardData.content || !cardData.content.fields) {
  //       setIsActiveResult("Unable to read card data. The card might still be processing.");
  //       return;
  //     }

  //     const fields = cardData.content.fields;
      
  //     // Create a detailed status message
  //     let statusMessage = [];

  //     // Safely access fields with optional chaining
  //     const pointsBalance = fields?.points_balance ?? '0';
  //     statusMessage.push(`Points Balance: ${pointsBalance}`);
      
  //     if (fields?.is_frozen === true) {
  //       statusMessage.push("Status: Frozen ❄️");
  //     } else {
  //       statusMessage.push("Status: Active ✅");
  //     }

  //     if (fields?.valid_until) {
  //       const expiryDate = new Date(Number(fields.valid_until) * 1000);
  //       statusMessage.push(`Expires: ${expiryDate.toLocaleDateString()}`);
  //     }

  //     // Add explorer link to the status message
  //     statusMessage.push(`View in Explorer: 
  //       <a href="https://testnet.suivision.xyz/object/${loyaltyIdStatus}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline">Open in Explorer</a>`);

  //     setIsActiveResult(statusMessage.join(" | "));
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  //     setIsActiveResult(`Error checking status: ${errorMessage}`);
  //   } finally {
  //     setIsStatusChecking(false);
  //   }
  // }

  return (
    <Container size="1" style={{ }}>
      <Box style={{ 
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.1)',
        background: 'linear-gradient(to bottom, #f0f9ff, white)',
        border: '1px solid #bfdbfe'
      }}>
        <Heading size="5" style={{ marginBottom: '1.5rem', color: '#1e40af' }}>Mint Loyalty NFT</Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              disabled={isMintPending || isMintSuccess}
               style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
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
              disabled={isMintPending || isMintSuccess}
               style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
            />
          </div>
          <Button 
            size="3" 
            onClick={mintNFT}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {isMintPending ? <ClipLoader size={20} color="white" /> : isMintSuccess ? "NFT Minted!" : "Mint NFT"}
          </Button>
          {txDigest && (
            <Text size="2" color="green">
              Transaction: <a href={`https://testnet.suivision.xyz/txblock/${txDigest}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>{txDigest}</a>
            </Text>
          )}
        </div>
        {/* Add Points */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Add Points (Admin)
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="AdminCap Object ID"
            value={adminCapIdAdd}
            onChange={handleAdminCapIdAddChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdAdd}
            onChange={handleLoyaltyIdAddChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s'
            }}
            placeholder="Points to Add"
            value={pointsToAdd}
            onChange={handlePointsToAddChange}
            type="number"
          />
          <Button size="3" onClick={addPoints}>
            {isAddPointsPending ? <ClipLoader size={20} color="white" /> : "Add Points"}
          </Button>
            {addPointsResult && 
              <Text 
                size="2" 
                color={addPointsResult.startsWith('Success') ? 'green' : 'red'}
                dangerouslySetInnerHTML={{ __html: addPointsResult }}
              />
            }
        </div>
        {/* Redeem Points */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Redeem Points
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdRedeem}
            onChange={handleLoyaltyIdRedeemChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Points to Redeem"
            value={pointsToRedeem}
            onChange={handlePointsToRedeemChange}
            type="number"
          />
          <Button 
            size="3" 
            onClick={redeemPoints} 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {isRedeemPending ? <ClipLoader size={20} color="white" /> : "Redeem Points"}
          </Button>
            {redeemResult && 
              <Text 
                size="2" 
                color={redeemResult.startsWith('Success') ? 'green' : 'red'}
                dangerouslySetInnerHTML={{ __html: redeemResult }}
              />
            }
        </div>
        {/* Burn Loyalty Card */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Burn Loyalty Card (Admin)
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="AdminCap Object ID"
            value={adminCapIdBurn}
            onChange={handleAdminCapIdBurnChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdBurn}
            onChange={handleLoyaltyIdBurnChange}
          />
          <Button 
            size="3" 
            onClick={burnLoyalty} 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {isBurnPending ? <ClipLoader size={20} color="white" /> : "Burn Loyalty Card"}
          </Button>
            {burnResult && 
              <Text 
                size="2" 
                color={burnResult.startsWith('Success') ? 'green' : 'red'}
                dangerouslySetInnerHTML={{ __html: burnResult }}
              />
            }
        </div>
        {/* Check Card Status */}
        {/* <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Check Card Status
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={loyaltyIdStatus}
            onChange={handleLoyaltyIdStatusChange}
          />
          <Button 
            size="3" 
            onClick={checkStatus} 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {isStatusChecking ? <ClipLoader size={20} color="white" /> : "Check Status"}
          </Button>
          {isActiveResult && 
            <Text 
              size="2" 
              style={{ color: '#3b82f6', padding: '0.5rem 0' }}
              dangerouslySetInnerHTML={{ __html: isActiveResult }}
            />
          }
        </div> */}

        {/* Tiered Membership */}
        {/* <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Tiered Membership Levels
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Card ID"
            value={cardIdForTier}
            onChange={handleCardIdForTierChange}
          />
          <select
            className="rt-TextFieldInput"
            value={selectedTier}
            onChange={handleTierChange}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none',
              color: '#1e40af'
            }}
          >
            <option value="">Select Membership Tier</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <Button size="3" style={{ backgroundColor: '#3b82f6', color: 'white' }}>Upgrade Tier</Button>
        </div> */}

        {/* Transfer Card */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Transfer Loyalty Card
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={transferCardId}
            onChange={handleTransferCardIdChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={handleRecipientAddressChange}
          />
          <Button 
            size="3" 
            onClick={handleTransferCard}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
            }}
          >
            {isTransferPending ? <ClipLoader size={20} color="white" /> : "Transfer Card"}
          </Button>
          {transferCardId && recipientAddress && (
            <Text size="2" style={{ color: '#3b82f6', padding: '0.5rem 0' }}>
              Ready to transfer card {transferCardId.slice(0, 6)}... to {recipientAddress.slice(0, 6)}...
            </Text>
          )}
        </div>

        {/* Extend/Refresh Expiry */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Extend Card Expiry (Admin)
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Admin Cap ID"
            value={adminCapIdAdd}
            onChange={handleAdminCapIdAddChange}
          />
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={extensionCardId}
            onChange={handleExtensionCardIdChange}
          />
          <input
            type="number"
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Extension Period (days)"
            value={extensionDays}
            onChange={handleExtensionDaysChange}
            min="1"
            max="365"
          />
          <Button 
            size="3" 
            onClick={handleExtendExpiry}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
            }}
          >
            {isExtendPending ? <ClipLoader size={20} color="white" /> : "Extend Expiry"}
          </Button>
        </div>

        {/* Freeze/Suspend Card */}
        <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Freeze/Suspend Card
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            className="rt-TextFieldInput"
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              backgroundColor: 'white',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            placeholder="Loyalty NFT Object ID"
            value={freezeCardId}
            onChange={handleFreezeCardIdChange}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button 
              size="3" 
              onClick={toggleFreeze}
              style={{ 
                flex: 1, 
                backgroundColor:  '#3b82f6',
                color: 'white',
              }}
            >
              {isFreezePending ? <ClipLoader size={20} color="white" /> : (isFrozen ? 'Unfreeze Card' : 'Freeze Card')}
            </Button>
          </div>
        </div>

        {/* Auto Burn Settings */}
        {/* <Heading size="4" style={{ margin: '2.5rem 0 1.5rem 0', color: '#1e40af', borderTop: '1px solid #bfdbfe', paddingTop: '2rem' }}>
          Auto Burn Settings
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="checkbox"
              id="autoBurn"
              checked={autoBurnEnabled}
              onChange={handleAutoBurnChange}
              style={{ 
                width: '20px', 
                height: '20px',
                accentColor: '#3b82f6'
              }}
            />
            <Text as="label" htmlFor="autoBurn" style={{ color: '#1e40af' }}>
              Enable Auto Burn on Expiry
            </Text>
          </div>
          <Button 
            size="3" 
            onClick={handleAutoBurnCleanup}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
            }}
          >
            Check & Apply Auto Burn
          </Button>
          {autoBurnEnabled && (
            <Text size="2" style={{ color: '#3b82f6', padding: '0.5rem 0' }}>
              Auto burn is enabled. Expired cards will be automatically burned.
            </Text>
          )}
        </div> */}

      </Box>
    </Container>
  );
}

export default MintNFT;