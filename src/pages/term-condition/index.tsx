import CAccordion from '@/components/CAccordion';
import Container from '@/components/Container';
import { Disclosure, FileTextIcon, SosmedGuide } from 'public/assets/vector';
import CircleMembership from './CircleMembership';
import DisclosureComp from './DisclosureComp';
import PrivacyPolicy from './PrivacyPolicy';
import SocialMediaGuide from './SocialMediaGuide';
import TermsConditions from './TermsConditions';

export default function Login(): React.ReactElement {
  const menus = [
    {
      label: 'Term & Condition',
      altStartAdornment: 'terms-condition',
      startAdornment: FileTextIcon
    },
    {
      label: 'Disclosure',
      altStartAdornment: 'disclosure',
      startAdornment: Disclosure
    },
    {
      label: 'Privacy & Policy',
      altStartAdornment: 'privacy-policy',
      startAdornment: PrivacyPolicy
    },
    {
      label: 'Social Media Guidelines',
      altStartAdornment: 'social-media-guide',
      startAdornment: SosmedGuide
    },
    {
      label: 'Circle Membership',
      altStartAdornment: 'circle-membership',
      startAdornment: CircleMembership
    }
  ];

  return (
    <div>
      <Container>
        <p className="font-bold text-2xl mt-8">Legal</p>
        <div className="mt-4">
          {menus.map(item => (
            <CAccordion
              key={item.altStartAdornment}
              title={item.label}
              description={
                item.altStartAdornment === 'terms-condition' ? (
                  <TermsConditions />
                ) : item.altStartAdornment === 'privacy-policy' ? (
                  <PrivacyPolicy />
                ) : item.altStartAdornment === 'disclosure' ? (
                  <DisclosureComp />
                ) : item.altStartAdornment === 'social-media-guide' ? (
                  <SocialMediaGuide />
                ) : (
                  <CircleMembership />
                )
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
