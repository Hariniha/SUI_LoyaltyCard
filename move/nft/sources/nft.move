module loyalty_card::nftdapp {
    use sui::package;
    use std::string::String;

    // Loyalty NFT with tier, status, expiration
    public struct Loyalty has key, store {
        id: object::UID,
        customer_id: address,
        image_url: String,
        points: u64,
        valid_until: u64,
        membership_level: u8, // 0=Bronze, 1=Silver, 2=Gold
        status: bool,         // true=active, false=frozen
    }

    // Admin capability
    public struct AdminCap has key, store { id: object::UID }

    // One-time witness
    public struct NFTDAPP has drop {}

    // ------------------- Init -------------------
    fun init(otw: NFTDAPP, ctx: &mut tx_context::TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // ------------------- Mint -------------------
    public fun mint_loyalty(customer_id: address, image_url: String, ctx: &mut tx_context::TxContext) {
        let loyalty = Loyalty {
            id: object::new(ctx),
            customer_id,
            image_url,
            points: 0,
            valid_until: tx_context::epoch(ctx) + 31_536_000, // ~1 year
            membership_level: 0,
            status: true,
        };
        transfer::public_transfer(loyalty, customer_id);
    }

    // ------------------- Points -------------------
    public fun add_points(_admin: &AdminCap, loyalty: &mut Loyalty, amount: u64, ctx: &tx_context::TxContext) {
        assert!(is_active(loyalty, ctx), 2);
        loyalty.points = loyalty.points + amount;
        update_membership(loyalty);
    }

    public fun redeem_points(loyalty: &mut Loyalty, amount: u64, ctx: &tx_context::TxContext) {
        assert!(is_active(loyalty, ctx), 2);
        assert!(loyalty.points >= amount, 1);
        loyalty.points = loyalty.points - amount;
        update_membership(loyalty);
    }

    // ------------------- Membership -------------------
    fun update_membership(loyalty: &mut Loyalty) {
        if (loyalty.points >= 1000) {
            loyalty.membership_level = 2; // Gold
        } else if (loyalty.points >= 500) {
            loyalty.membership_level = 1; // Silver
        } else {
            loyalty.membership_level = 0; // Bronze
        }
    }

    // ------------------- Admin -------------------
    public fun burn_loyalty(_admin: &AdminCap, loyalty: Loyalty) {
        let Loyalty { id, .. } = loyalty;
        object::delete(id);
    }

    public fun extend_validity(_admin: &AdminCap, loyalty: &mut Loyalty, extra_time: u64) {
        loyalty.valid_until = loyalty.valid_until + extra_time;
    }

    public fun freeze_card(_admin: &AdminCap, loyalty: &mut Loyalty) { loyalty.status = false; }
    public fun unfreeze_card(_admin: &AdminCap, loyalty: &mut Loyalty) { loyalty.status = true; }

    // ------------------- User -------------------
    public fun transfer_loyalty(loyalty: Loyalty, recipient: address) {
        transfer::public_transfer(loyalty, recipient);
    }

    // Auto-burn expired (returns card if still valid)
    public fun cleanup_expired(loyalty: Loyalty, ctx: &tx_context::TxContext): Loyalty {
        if (!is_active(&loyalty, ctx)) {
            let Loyalty { id, .. } = loyalty;
            object::delete(id);
            abort 100; // expired
        };
        loyalty
    }

    // ------------------- Helper -------------------
    public fun is_active(loyalty: &Loyalty, ctx: &tx_context::TxContext): bool {
        loyalty.status && tx_context::epoch(ctx) < loyalty.valid_until
    }
}
