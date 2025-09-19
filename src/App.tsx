import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import MintNFT from "./mintNFT";

function App() {
  const currentAccount = useCurrentAccount();
  return (
    <>
      <Flex
        position="sticky"
        px="6"
        py="3"
        justify="between"
        align="center"
        style={{
          borderBottom: "1px solid #2563eb",
          background: "#2563eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        <Box style={{ padding: "0.4rem" }}>
          <Heading size="6" style={{ 
            color: "#ffffff", 
            letterSpacing: "1px",
            fontWeight: 800,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            fontSize: "2rem",
            margin: 0
          }}>
            SuiCard
          </Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container size="3">
        <Container
          mt="6"
          pt="4"
          px="6"
          style={{ 
            background: "linear-gradient(to bottom, #f0f9ff, #white)",
            minHeight: 500,
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(37, 99, 235, 0.1)",
            border: "1px solid #bfdbfe"
          }}
        >
          {currentAccount ? (
            <MintNFT />
          ) : (
            <Flex direction="column" align="center" justify="center" gap="4" style={{ minHeight: "400px" }}>
              <Heading size="8" style={{ color: "#1e40af" }}>
                Please connect your wallet
              </Heading>
            </Flex>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;