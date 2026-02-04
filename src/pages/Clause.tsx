import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import shoppingBanner from '../assets/shopping_platform_banner.png';

export default function Clause() {
  const navigate = useNavigate();

  return (
    <div className="clause-page">
      <header className="clause-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="clause-title">Clause</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="clause-content">
        <div className="clause-banner">
          <img
            src={shoppingBanner}
            alt="Shopping Platform"
            className="banner-image"
          />
        </div>

        <article className="clause-article">
          <h2 className="article-title">
            Shopee E-Commerce Platform
            <br />
            User Behavior And Platform Usage
            <br />
            Compliance Regulations
          </h2>
          <p className="article-date">2025/01/31</p>

          <div className="article-body">
            <p className="intro-text">
              After reading the Agreement Global Articles Of Clause in this co-branded User Compliance Regulations, you have acknowledged all the rights and obligations under this Agreement. Please do not register for use unless you have read and understood the full content of this agreement and have confirmed that you fully understand the content of all the provisions. Once you choose "Agree" and submit a registration application or registered for use of this service, it means that you have fully understood this agreement and have agreed to abide by all agreements.
            </p>

            <section className="clause-section">
              <h3>Clause 1 · General Provisions</h3>
              <p><strong>1.1.</strong> Service Background And The Platform: Pursuant to this User Agreement, Shopee, its affiliates, and their subsidiaries (hereinafter collectively referred to as "the company") shall provide online shopping and e-commerce services.</p>
              <p><strong>1.2.</strong> You must agree to "Register The User To Modify This Agreement At Any Time" Of The Agreement. After A Lot Agreement Takes Effect, Users Shall Enjoy The Rights And Obligations Under This Agreement Immediately.</p>
              <p><strong>1.3.</strong> You Confirm That You Have Reached Legal Age And Have Full Rights Of Civil Conduct When You Register And Use The Services Of This User.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 2 · Service Scope And Usage (Of Service And Behavior)</h3>
              <p><strong>2.1.</strong> By using shopping services, the company agrees to enable users to register and use the account according to this agreement in accordance with the applicable laws, regulations and this agreement, so that users can browse and purchase products, review seller ratings, and more.</p>
              <p><strong>2.2.</strong> For information on a user's use of goods or services may contain links not under the company's control. You shall read the Terms And Privacy Agreements on Related Sites Yourself.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 3 · Rights And Users Of Registration Transactions</h3>
              <p><strong>3.1.</strong> Users Provide Right To Use Accounts And Their Password Are Your Primary And Sole Responsibility. Loss Caused By Them, And They Should Bear Corresponding Legal Responsibility.</p>
              <p><strong>3.2.</strong> If you discover your account has been used illegally or abnormally, you shall immediately notify the company, the company will take corresponding measures, but the company does not assume any responsibility for the losses you have suffered before such measures are taken.</p>
              <p><strong>3.3.</strong> If Your Account Access Or Use Information Are Not Authorized, And You Shall Separate From A Legal Account Immediately.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 4 · User Rights And Obligations</h3>
              <p><strong>4.1.</strong> Users Have The Right To supervise the platform's services and make suggestions to the company on the platform's services.</p>
              <p><strong>4.2.</strong> Users Must Provide Accurate Personal Information, Including But Not Limited To: Email Address, Phone Number, Contact Address, Etc. Users Shall Update Their Information In Time.</p>
              <p><strong>4.3.</strong> Users Shall Not Register An Account Using Other's Names (Including But Not Limited To Assuming The Names And Identifications Of Others; Stealing Others' Accounts).</p>
              <p><strong>4.4.</strong> User's Password And Protection Of Information Stored In This Service Are The User's Personal Responsibility. You Shall Bear Incurred Loss On The Disclosure Of Info And Its Cause.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 5 · Platform Transaction Rules And Service Terms</h3>
              <p><strong>5.1.</strong> Depending On The Laws And Policies Of Each Host Country, And In Certain Cases Where Our Company Has The Right To Refuse Registration Of Specific Countries And Online Transaction In Certain Restricted Trading Areas.</p>
              <p><strong>5.2.</strong> If a user discovers any illegal trading behavior on our e-commerce platform, our company has the right to delete the related information immediately. Our company reserves the right to close illegal accounts. If it involves illegal crimes, our company will report it to the local police in accordance with law.</p>
              <p><strong>5.3.</strong> Under Any Circumstances, The Company Shall Not Be Liable For Any Indirect, Consequential, Punitive, Incidental, Special Or Penal Damages, Including Loss Of Profits Incurred By Users Using The Platform Services.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 6 · Privacy And Information Protection</h3>
              <p><strong>6.1.</strong> Protecting User Privacy Is A Basic Principle Of The Company. The Company Will Not Disclose Your Information To Any Third Party Without Your Authorization.</p>
              <p><strong>6.2.</strong> The Company Will Use Various Security Technologies And Procedures To Establish A Complete Management System To Protect Your Personal Information From Unauthorized Access, Use Or Disclosure.</p>
              <p><strong>6.3.</strong> Users Understand And Agree That, In Order To Better Serve Users, The Company Has The Right To Analyze And Commercially Use Non-Privacy User Database And User Information.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 7 · Termination Of Service And Agreement</h3>
              <p><strong>7.1.</strong> You have the right to terminate this agreement at any time by notifying our company in writing or by phone, and canceling the account by terminating the use of the platform services.</p>
              <p><strong>7.2.</strong> The company may terminate this agreement and close your account in one of the following situations:</p>
              <ul>
                <li>You Have Violated The Provisions Of This Agreement;</li>
                <li>You Have Used Improper Means To Harm The Company Or Any Third Party's Rights;</li>
                <li>The account has not been used for one consecutive year;</li>
                <li>You No Longer Meet The Registration Requirements As Defined In This Agreement.</li>
              </ul>
            </section>

            <section className="clause-section">
              <h3>Clause 8 · Intellectual Property Rights</h3>
              <p><strong>8.1.</strong> All intellectual property rights of any text, picture, graphics, audio, video and other content provided by the company in the platform belong to the company. Without authorization from the company, no one may use it (including but not limited to monitoring, copying, transmitting, displaying, mirroring, uploading, downloading).</p>
              <p><strong>8.2.</strong> Users Shall Not Violate The Trademark Rights, Copyright, Trade Secrets And Other Intellectual Property Rights Of The Company And Other Third Parties.</p>
            </section>

            <section className="clause-section">
              <h3>Clause 9 · Applicable Law And Dispute Resolution</h3>
              <p><strong>9.1.</strong> The establishment, effectiveness, performance of this agreement and the resolution of disputes shall be governed by the laws of the country where the company is registered.</p>
              <p><strong>9.2.</strong> If any dispute or controversy arises between the user and the company, it shall first be resolved through friendly negotiation; if the negotiation fails, the user agrees to submit the dispute or controversy to the court with jurisdiction where the company is located.</p>
            </section>

            <p className="footer-text">
              I Guarantee That I Have Carefully Read And Understood This Agreement. The Company And I Agree That We Have Understood The Clauses Aforementioned, Especially The Exemption Or Limitation Of Liability Clauses.
            </p>
          </div>
        </article>
      </main>

      <style>{`
        .clause-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .clause-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border-primary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .back-btn {
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .back-btn:hover {
          background: var(--color-bg-tertiary);
        }

        .back-btn svg {
          font-size: 24px;
        }

        .clause-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .header-spacer {
          width: 40px;
        }

        .clause-content {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--space-2xl) var(--space-xl);
        }

        .clause-banner {
          width: 100%;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--space-2xl);
          box-shadow: var(--shadow-lg);
        }

        .banner-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          aspect-ratio: 16 / 9;
        }

        .clause-article {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-3xl);
          box-shadow: var(--shadow-md);
        }

        .article-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.4;
          margin: 0 0 var(--space-sm) 0;
        }

        .article-date {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 var(--space-2xl) 0;
        }

        .article-body {
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
          line-height: 1.8;
        }

        .intro-text {
          margin-bottom: var(--space-2xl);
          padding: var(--space-lg);
          background: var(--color-bg-tertiary);
          border-left: 4px solid var(--color-accent-primary);
          border-radius: var(--radius-md);
        }

        .clause-section {
          margin-bottom: var(--space-2xl);
          padding-bottom: var(--space-xl);
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .clause-section:last-of-type {
          border-bottom: none;
        }

        .clause-section h3 {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 var(--space-lg) 0;
        }

        .clause-section p {
          margin: 0 0 var(--space-md) 0;
        }

        .clause-section ul {
          margin: var(--space-md) 0;
          padding-left: var(--space-2xl);
        }

        .clause-section li {
          margin-bottom: var(--space-sm);
        }

        .footer-text {
          margin-top: var(--space-2xl);
          padding: var(--space-lg);
          background: var(--color-bg-elevated);
          border-radius: var(--radius-md);
          font-style: italic;
          text-align: center;
        }

        @media (max-width: 768px) {
          .clause-header {
            padding: var(--space-md) var(--space-lg);
          }

          .clause-title {
            font-size: var(--font-size-xl);
          }

          .clause-content {
            padding: var(--space-lg);
          }

          .clause-article {
            padding: var(--space-xl);
          }

          .article-title {
            font-size: var(--font-size-lg);
          }
        }

        @media (max-width: 480px) {
          .clause-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .clause-title {
            font-size: var(--font-size-lg);
          }

          .header-spacer {
            width: 36px;
          }

          .clause-content {
            padding: var(--space-md);
          }

          .clause-banner {
            margin-bottom: var(--space-lg);
          }

          .clause-article {
            padding: var(--space-lg);
          }

          .article-title {
            font-size: var(--font-size-base);
          }

          .article-body {
            font-size: var(--font-size-xs);
          }
        }
      `}</style>
    </div>
  );
}
