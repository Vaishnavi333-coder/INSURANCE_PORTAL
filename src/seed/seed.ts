import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Plan } from '../modules/plans/entities/plans.entity';
import { Policy, PolicyStatus, PolicyType } from '../modules/policies/entities/policy.entity';
import { Claim, ClaimStatus } from '../modules/claims/entities/claim.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const planRepo = app.get<Repository<Plan>>(getRepositoryToken(Plan));
  const policyRepo = app.get<Repository<Policy>>(getRepositoryToken(Policy));
  const claimRepo = app.get<Repository<Claim>>(getRepositoryToken(Claim));

  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  let admin = await userRepo.findOne({ where: { email: 'admin@insureconnect.com' } });
  if (!admin) {
    admin = userRepo.create({
      name: 'Admin User',
      email: 'admin@insureconnect.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✅ Admin user created: admin@insureconnect.com / Admin@123');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Create regular users
  const userPassword = await bcrypt.hash('User@123', 10);
  const usersData = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Wilson', email: 'bob@example.com' },
  ];

  const users: User[] = [];
  for (const userData of usersData) {
    let user = await userRepo.findOne({ where: { email: userData.email } });
    if (!user) {
      user = userRepo.create({
        ...userData,
        passwordHash: userPassword,
        role: UserRole.USER,
      });
      await userRepo.save(user);
      console.log(`✅ User created: ${userData.email} / User@123`);
    } else {
      console.log(`ℹ️ User ${userData.email} already exists`);
    }
    users.push(user);
  }

  // Create plans
  const plansData = [
    {
      name: 'Health Protect Plus',
      description: 'Comprehensive health coverage for hospitalisation and critical illness',
      insurer: 'Cigna',
      premiumAmount: 4999,
      coverageAmount: 500000,
      category: 'health',
    },
    {
      name: 'Motor Shield Classic',
      description: 'Third-party and comprehensive motor cover for peace of mind',
      insurer: 'Bajaj',
      premiumAmount: 3499,
      coverageAmount: 300000,
      category: 'motor',
    },
    {
      name: 'Home Guardian',
      description: 'Protection against theft, fire, and natural disasters',
      insurer: 'HDFC',
      premiumAmount: 2499,
      coverageAmount: 1000000,
      category: 'home',
    },
    {
      name: 'Travel Explore',
      description: 'Travel insurance covering medical emergencies and baggage',
      insurer: 'AXA',
      premiumAmount: 1999,
      coverageAmount: 250000,
      category: 'travel',
    },
    {
      name: 'Life Secure Gold',
      description: 'Life cover to secure your family future and liabilities',
      insurer: 'ICICI',
      premiumAmount: 7999,
      coverageAmount: 5000000,
      category: 'life',
    },
    {
      name: 'Accident Protector',
      description: 'Accident protection with immediate support and payout',
      insurer: 'Reliance',
      premiumAmount: 1099,
      coverageAmount: 300000,
      category: 'accident',
    },
  ];

  const plans: Plan[] = [];
  for (const planData of plansData) {
    let plan = await planRepo.findOne({ where: { name: planData.name } });
    if (!plan) {
      plan = planRepo.create(planData);
      await planRepo.save(plan);
      console.log(`✅ Plan created: ${planData.name}`);
    } else {
      console.log(`ℹ️ Plan ${planData.name} already exists`);
    }
    plans.push(plan);
  }

  // Create sample policies for users
  const policiesData = [
    { user: users[0], plan: plans[0], policyType: PolicyType.HEALTH, status: PolicyStatus.ACTIVE },
    { user: users[0], plan: plans[1], policyType: PolicyType.MOTOR, status: PolicyStatus.ACTIVE },
    { user: users[1], plan: plans[2], policyType: PolicyType.HOME, status: PolicyStatus.ACTIVE },
    { user: users[1], plan: plans[4], policyType: PolicyType.LIFE, status: PolicyStatus.ACTIVE },
    { user: users[2], plan: plans[3], policyType: PolicyType.TRAVEL, status: PolicyStatus.ACTIVE },
    { user: users[2], plan: plans[5], policyType: PolicyType.ACCIDENT, status: PolicyStatus.LAPSED },
  ];

  const policies: Policy[] = [];
  for (const policyData of policiesData) {
    const existing = await policyRepo.findOne({
      where: {
        user: { userId: policyData.user.userId },
        plan: { planId: policyData.plan.planId },
      },
    });
    if (!existing) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const policy = policyRepo.create({
        user: policyData.user,
        plan: policyData.plan,
        policyType: policyData.policyType,
        premiumAmount: policyData.plan.premiumAmount,
        startDate,
        endDate,
        status: policyData.status,
        userId: policyData.user.userId,
        deleted: false,
      });
      await policyRepo.save(policy);
      policies.push(policy);
      console.log(`✅ Policy created: ${policyData.policyType} for ${policyData.user.email}`);
    } else {
      policies.push(existing);
      console.log(`ℹ️ Policy already exists for ${policyData.user.email}`);
    }
  }

  // Create sample claims
  const claimsData = [
    { policy: policies[0], claimAmount: 15000, description: 'Hospital admission for fever treatment', status: ClaimStatus.APPROVED },
    { policy: policies[0], claimAmount: 5000, description: 'Medication expenses', status: ClaimStatus.PENDING },
    { policy: policies[1], claimAmount: 25000, description: 'Car accident repair', status: ClaimStatus.IN_REVIEW },
    { policy: policies[2], claimAmount: 50000, description: 'Water damage repair', status: ClaimStatus.PENDING },
    { policy: policies[3], claimAmount: 100000, description: 'Critical illness claim', status: ClaimStatus.REJECTED },
    { policy: policies[4], claimAmount: 10000, description: 'Lost baggage claim', status: ClaimStatus.APPROVED },
  ];

  for (const claimData of claimsData) {
    if (!claimData.policy) continue;
    
    const existing = await claimRepo.findOne({
      where: {
        policy: { policyId: claimData.policy.policyId },
        description: claimData.description,
      },
    });
    
    if (!existing) {
      const claim = claimRepo.create({
        policy: claimData.policy,
        userId: claimData.policy.userId,
        claimAmount: claimData.claimAmount,
        description: claimData.description,
        status: claimData.status,
        deleted: false,
      });
      await claimRepo.save(claim);
      console.log(`✅ Claim created: ${claimData.description}`);
    } else {
      console.log(`ℹ️ Claim already exists: ${claimData.description}`);
    }
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@insureconnect.com / Admin@123');
  console.log('   User 1: john@example.com / User@123');
  console.log('   User 2: jane@example.com / User@123');
  console.log('   User 3: bob@example.com / User@123');

  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

