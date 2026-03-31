import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Gift, Flame, ShieldCheck, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AchievementDef {
  key: string;
  title: string;
  threshold: number;
  icon: typeof Trophy;
}

const ACHIEVEMENTS: AchievementDef[] = [
  { key: 'beginner', title: 'Beginner', threshold: 3, icon: ShieldCheck },
  { key: 'consistent', title: 'Consistent', threshold: 7, icon: Gift },
  { key: 'dedicated', title: 'Dedicated', threshold: 30, icon: Trophy }
];

export function Profile() {
  const { user } = useAuth();

  const unlocked = useMemo(() => {
    const streak = user?.streak ?? 0;
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      done: streak >= achievement.threshold
    }));
  }, [user?.streak]);

  if (!user) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
        Profile unavailable. Please login.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="px-1">
        <h2 className="text-4xl font-bold tracking-tight">Profile</h2>
        <p className="accent-font text-gold-400 text-xl">Your growth, one day at a time</p>
      </header>

      <section className="rounded-[2.4rem] border border-white/10 bg-white/5 p-6 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold">Email</p>
          <p className="text-lg font-semibold mt-1">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gold-500/25 bg-gold-500/10 px-4 py-4">
            <div className="flex items-center gap-2 text-gold-400">
              <Flame size={18} />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Streak</span>
            </div>
            <p className="text-2xl font-black mt-2">{user.streak} day{user.streak === 1 ? '' : 's'}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div className="flex items-center gap-2 text-gold-400">
              <Gift size={18} />
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Last Active</span>
            </div>
            <p className="text-base font-semibold mt-2">{new Date(user.lastActiveDate).toLocaleDateString()}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Gift size={18} className="text-gold-400" />
          Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {unlocked.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.key}
                whileHover={{ y: -2 }}
                className={`rounded-2xl border p-4 ${
                  achievement.done
                    ? 'border-gold-500/35 bg-gold-500/10'
                    : 'border-white/10 bg-white/5 opacity-70'
                }`}
              >
                <Icon size={20} className={achievement.done ? 'text-gold-400' : 'text-white/50'} />
                <p className="mt-2 font-semibold">{achievement.title}</p>
                <p className="text-xs text-white/55 mt-1">{achievement.threshold} days</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
