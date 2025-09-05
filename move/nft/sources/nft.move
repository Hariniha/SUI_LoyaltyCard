module loyalty_card::nftdapp {
    use sui::package;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use std::string::String;

    // NFT struct with points and expiration
    public struct Loyalty has key, store {
        id: UID,
        customer_id: address,
        image_url: String,
        points: u64,
        valid_until: u64, // Unix timestamp (seconds)
    }

    // Admin capability
    public struct AdminCap has key, store {
        id: UID,
    }

    // One-time witness
    public struct NFTDAPP has drop {}

    // Initializer
    fun init(otw: NFTDAPP, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // Mint a new Loyalty NFT with default expiration (e.g., 1 year from now)
    public fun mint_loyalty(
        customer_id: address,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let loyalty = Loyalty {
            id: object::new(ctx),
            customer_id,
            image_url,
            points: 0,
            valid_until: tx_context::epoch(ctx) + 31_536_000_000, // ~1 year in milliseconds
        };
        transfer::transfer(loyalty, customer_id);
    }

    // Add points (admin-only, with expiration check)
    public fun add_points(
        _admin: &AdminCap, // Prefixed with `_` to silence unused warning (add admin check later)
        loyalty: &mut Loyalty,
        amount: u64,
        ctx: &TxContext, // Added to check current time
    ) {
        assert!(is_active(loyalty, ctx), 2); // Ensure card is not expired
        loyalty.points = loyalty.points + amount;
    }

    // Redeem points (with expiration check)
    public fun redeem_points(
        loyalty: &mut Loyalty,
        amount: u64,
        ctx: &TxContext, // Added to check current time
    ) {
        assert!(is_active(loyalty, ctx), 2); // Ensure card is not expired
        assert!(loyalty.points >= amount, 1); // Not enough points
        loyalty.points = loyalty.points - amount;
    }

    // Burn loyalty card (admin-only)
    public fun burn_loyalty(
        _admin: &AdminCap, // Prefixed with `_` to silence unused warning
        loyalty: Loyalty,
    ) {
        let Loyalty { id, customer_id: _, image_url: _, points: _, valid_until: _ } = loyalty;
        object::delete(id);
    }

    // Check if loyalty card is active (not expired)
    public fun is_active(loyalty: &Loyalty, ctx: &TxContext): bool {
        tx_context::epoch(ctx) < loyalty.valid_until
    }
}