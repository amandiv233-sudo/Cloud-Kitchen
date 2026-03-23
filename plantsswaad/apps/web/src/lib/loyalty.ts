import { supabase } from './supabase';

/**
 * Validates and updates a user's loyalty stamps based on their new order.
 * Awards a discount code when 5 total unique days have stamps.
 */
export async function processOrderLoyalty(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const sb = supabase as any;

    // Read current loyalty record
    const { data: tracker, error: fetchError } = await sb
        .from('loyalty_tracker')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!tracker) {
        if (fetchError?.code === 'PGRST116') {
            // First ever order
            await sb.from('loyalty_tracker').insert({
                user_id: userId,
                total_stamps: 1,
                consecutive_streak: 1,
                last_order_date: today
            });
            return { stampEarned: true, reward: null, currentStamps: 1, currentStreak: 1 };
        }
        console.error('Loyalty Error:', fetchError);
        return null;
    }

    // If order was already processed today, no new stamp
    if (tracker.last_order_date === today) {
        return { stampEarned: false, reward: null, currentStamps: tracker.total_stamps, currentStreak: tracker.consecutive_streak };
    }

    let newTotal = tracker.total_stamps + 1;
    let reward = null;

    // Check thresholds: 5 total stamps -> Major reward
    if (newTotal === 5) {
        reward = { 
            code: `PSHERO50_${Math.random().toString(36).substring(2, 6).toUpperCase()}`, 
            percentage: 50 
        };
        newTotal = 0; // Reset upon earning
    }

    // Update their tracker
    await sb.from('loyalty_tracker').update({
        total_stamps: newTotal,
        consecutive_streak: newTotal, // keeping streak identical to total so schema doesn't break
        last_order_date: today,
        updated_at: new Date().toISOString()
    }).eq('user_id', userId);

    // Give them the reward code
    if (reward) {
        await sb.from('discount_codes').insert({
            user_id: userId,
            code: reward.code,
            discount_percentage: reward.percentage,
            expires_at: new Date(Date.now() + 30 * 86400000).toISOString() // Valid 30 days
        });
        
        // In a real app, trigger an email or SMS here
        console.log(`[Loyalty Webhook] Dispatch SMS/Email to user with code ${reward.code}`);
    }

    return { stampEarned: true, reward, currentStamps: newTotal, currentStreak: newTotal };
}

export async function fetchUserLoyaltyInfo(userId: string) {
    const sb = supabase as any;
    const { data } = await sb.from('loyalty_tracker').select('*').eq('user_id', userId).single();
    return data;
}
